import {
  AccessRequest,
  AuthorizationResult,
  EHRRecordType,
  Permission,
  RequestStatus,
} from '../types';
import { storageService } from './storageService';
import { blockchainService } from './blockchainService';

export const authorizationService = {
  // Create a new access request from a Doctor to a Patient
  createAccessRequest(params: {
    doctorDid: string;
    doctorName: string;
    patientDid: string;
    patientName: string;
    institution: string;
    requestedRecords: EHRRecordType[];
    purpose: string;
    accessDurationHours: number;
    isEmergency?: boolean;
    emergencyReason?: string;
  }): AccessRequest {
    const timestamp = new Date().toISOString();
    const requestId = 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const newRequest: AccessRequest = {
      id: requestId,
      doctorDid: params.doctorDid,
      doctorName: params.doctorName,
      patientDid: params.patientDid,
      patientName: params.patientName,
      institution: params.institution,
      requestedRecords: params.requestedRecords,
      purpose: params.purpose,
      accessDurationHours: params.accessDurationHours,
      requestTimestamp: timestamp,
      status: 'PENDING' as RequestStatus,
      isEmergency: params.isEmergency || false,
      emergencyReason: params.emergencyReason,
    };

    storageService.addAccessRequest(newRequest);

    // Record on blockchain
    const tx = blockchainService.recordTransaction({
      type: 'ACCESS_REQUESTED',
      actorDid: params.doctorDid,
      actorName: params.doctorName,
      patientDid: params.patientDid,
      institution: params.institution,
      details: `Doctor ${params.doctorName} requested [${params.requestedRecords.join(', ')}] access for: "${params.purpose}" (${params.accessDurationHours}h).`,
      metadata: {
        records: params.requestedRecords.join(','),
        duration: params.accessDurationHours,
      },
    });

    newRequest.transactionHash = tx.txHash;

    storageService.addNotification({
      title: 'Doctor Access Request Received',
      message: `${params.doctorName} (${params.institution}) requested access to your ${params.requestedRecords.join(', ')}.`,
      type: 'info',
    });

    return newRequest;
  },

  // Patient approves access request
  approveAccessRequest(requestId: string): { success: boolean; permission?: Permission; txHash?: string } {
    const requests = storageService.getAccessRequests();
    const req = requests.find((r) => r.id === requestId);

    if (!req) {
      return { success: false };
    }

    const grantedDate = new Date();
    const expiryDate = new Date(
      grantedDate.getTime() + req.accessDurationHours * 60 * 60 * 1000
    );

    // Blockchain transaction
    const tx = blockchainService.recordTransaction({
      type: 'ACCESS_APPROVED',
      actorDid: req.patientDid,
      actorName: req.patientName,
      patientDid: req.patientDid,
      institution: req.institution,
      status: 'CONFIRMED',
      details: `Patient ${req.patientName} APPROVED dynamic access to [${req.requestedRecords.join(', ')}] for ${req.doctorName}. Valid until ${expiryDate.toLocaleString()}.`,
      metadata: {
        doctorDid: req.doctorDid,
        records: req.requestedRecords.join(','),
        validUntil: expiryDate.toISOString(),
      },
    });

    // Create active permission
    const permission: Permission = {
      id: 'perm-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      requestId: req.id,
      doctorDid: req.doctorDid,
      doctorName: req.doctorName,
      patientDid: req.patientDid,
      patientName: req.patientName,
      institution: req.institution,
      recordTypes: req.requestedRecords,
      permissionLevel: 'READ',
      grantedDate: grantedDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'ACTIVE',
      isEmergency: req.isEmergency || false,
      transactionHash: tx.txHash,
    };

    storageService.addPermission(permission);
    storageService.updateAccessRequest(requestId, {
      status: 'APPROVED',
      responseTimestamp: grantedDate.toISOString(),
      transactionHash: tx.txHash,
    });

    storageService.addNotification({
      title: 'Access Approved Successfully',
      message: `Granted ${req.doctorName} permission for ${req.requestedRecords.join(', ')}. Transaction: ${tx.txHash.slice(0, 12)}...`,
      type: 'success',
    });

    return { success: true, permission, txHash: tx.txHash };
  },

  // Patient rejects access request
  rejectAccessRequest(requestId: string, reason?: string): { success: boolean; txHash?: string } {
    const requests = storageService.getAccessRequests();
    const req = requests.find((r) => r.id === requestId);

    if (!req) {
      return { success: false };
    }

    const timestamp = new Date().toISOString();
    const tx = blockchainService.recordTransaction({
      type: 'ACCESS_REJECTED',
      actorDid: req.patientDid,
      actorName: req.patientName,
      patientDid: req.patientDid,
      institution: req.institution,
      details: `Patient ${req.patientName} REJECTED access request by ${req.doctorName}. Reason: ${reason || 'Patient declined consent'}`,
      metadata: { doctorDid: req.doctorDid, reason: reason || 'Declined' },
    });

    storageService.updateAccessRequest(requestId, {
      status: 'REJECTED',
      responseTimestamp: timestamp,
      transactionHash: tx.txHash,
    });

    storageService.addNotification({
      title: 'Access Request Rejected',
      message: `Declined access request from ${req.doctorName}. Block entry created.`,
      type: 'info',
    });

    return { success: true, txHash: tx.txHash };
  },

  // Patient revokes active permission
  revokePermission(permissionId: string): { success: boolean; txHash?: string } {
    const perms = storageService.getPermissions();
    const perm = perms.find((p) => p.id === permissionId);

    if (!perm || perm.status !== 'ACTIVE') {
      return { success: false };
    }

    const timestamp = new Date().toISOString();

    const tx = blockchainService.recordTransaction({
      type: 'ACCESS_REVOKED',
      actorDid: perm.patientDid,
      actorName: perm.patientName,
      patientDid: perm.patientDid,
      institution: perm.institution,
      details: `Patient ${perm.patientName} REVOKED permission [${perm.id}] from ${perm.doctorName}. Access ceased immediately.`,
      metadata: { permissionId, doctorDid: perm.doctorDid },
    });

    storageService.updatePermission(permissionId, {
      status: 'REVOKED',
      revokedDate: timestamp,
    });

    // Also record security event
    storageService.addSecurityEvent({
      id: 'sec-rev-' + Date.now(),
      timestamp,
      type: 'PERMISSION_REVOKED',
      severity: 'MEDIUM',
      actorDid: perm.patientDid,
      targetDid: perm.doctorDid,
      institution: perm.institution,
      description: `Permission ${perm.id} explicitly revoked by patient. Future access requests will be denied.`,
      actionTaken: 'Permission state transitioned to REVOKED in local ledger cache.',
    });

    storageService.addNotification({
      title: 'Access Revoked',
      message: `Revoked access for ${perm.doctorName}. Recorded on-chain with tx hash: ${tx.txHash.slice(0, 10)}...`,
      type: 'warning',
    });

    return { success: true, txHash: tx.txHash };
  },

  // Break-glass Emergency Access
  grantEmergencyAccess(params: {
    doctorDid: string;
    doctorName: string;
    patientDid: string;
    patientName: string;
    institution: string;
    emergencyReason: string;
    durationHours: number;
  }): { success: boolean; permission: Permission; txHash: string } {
    const timestamp = new Date();
    const expiryDate = new Date(timestamp.getTime() + params.durationHours * 60 * 60 * 1000);

    // Record on blockchain
    const tx = blockchainService.recordTransaction({
      type: 'EMERGENCY_ACCESS',
      actorDid: params.doctorDid,
      actorName: params.doctorName,
      patientDid: params.patientDid,
      institution: params.institution,
      status: 'FLAGGED',
      details: `BREAK-GLASS EMERGENCY ACCESS activated by ${params.doctorName}. Reason: "${params.emergencyReason}". Mandatory post-incident audit scheduled.`,
      metadata: {
        reason: params.emergencyReason,
        duration: params.durationHours,
        breakGlass: true,
      },
    });

    const permission: Permission = {
      id: 'perm-emg-' + Date.now(),
      requestId: 'req-emg-' + Date.now(),
      doctorDid: params.doctorDid,
      doctorName: params.doctorName,
      patientDid: params.patientDid,
      patientName: params.patientName,
      institution: params.institution,
      // Full clinical record types except strict Genetic Data unless specifically overridden
      recordTypes: [
        'Diagnosis',
        'Prescription',
        'Laboratory Report',
        'Allergy',
        'Treatment History',
        'Medical Notes',
      ],
      permissionLevel: 'READ',
      grantedDate: timestamp.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'ACTIVE',
      isEmergency: true,
      transactionHash: tx.txHash,
    };

    storageService.addPermission(permission);

    // Security event
    storageService.addSecurityEvent({
      id: 'sec-emg-' + Date.now(),
      timestamp: timestamp.toISOString(),
      type: 'EMERGENCY_ACCESS',
      severity: 'HIGH',
      actorDid: params.doctorDid,
      targetDid: params.patientDid,
      institution: params.institution,
      description: `Break-glass emergency access invoked by ${params.doctorName}: ${params.emergencyReason}`,
      actionTaken: 'Temporary emergency permission granted with real-time logging.',
    });

    storageService.addNotification({
      title: 'Emergency Access Granted',
      message: `Break-glass protocol triggered by ${params.doctorName}. Valid for ${params.durationHours} hours.`,
      type: 'warning',
    });

    return { success: true, permission, txHash: tx.txHash };
  },

  // CORE DYNAMIC AUTHORIZATION ENGINE
  // Evaluates whether a doctor can access a specific patient's record type in a specific context
  evaluateAccess(params: {
    doctorDid: string;
    doctorName?: string;
    patientDid: string;
    requestedRecordType: EHRRecordType;
    institution: string;
    context?: string;
  }): AuthorizationResult {
    const { doctorDid, patientDid, requestedRecordType, institution } = params;

    // Check if identity exists
    const users = storageService.getUsers();
    const doctor = users.find((u) => u.did === doctorDid);
    if (!doctor || doctor.role !== 'doctor') {
      return {
        granted: false,
        reason: 'Unauthenticated or invalid physician Decentralized Identity (DID).',
        code: 'ACCESS_DENIED_UNAUTHENTICATED',
      };
    }

    const permissions = storageService.getPermissions();
    const now = new Date();

    // Look for active permissions for this doctor and patient
    const relevantPerms = permissions.filter(
      (p) => p.doctorDid === doctorDid && p.patientDid === patientDid
    );

    if (relevantPerms.length === 0) {
      // Check if there was an access request that is pending or rejected
      const requests = storageService.getAccessRequests().filter(
        (r) => r.doctorDid === doctorDid && r.patientDid === patientDid
      );
      const isPending = requests.some((r) => r.status === 'PENDING');
      const isRejected = requests.some((r) => r.status === 'REJECTED');

      let reason = 'Patient consent is not active. No granted permission found on blockchain ledger.';
      if (isPending) {
        reason = 'Access request is currently PENDING approval by patient Sarah Jenkins.';
      } else if (isRejected) {
        reason = 'Patient Sarah Jenkins previously REJECTED an access request from this doctor.';
      }

      return {
        granted: false,
        reason,
        code: 'ACCESS_DENIED_NO_CONSENT',
      };
    }

    // Check if permission was explicitly revoked
    const revokedPerm = relevantPerms.find((p) => p.status === 'REVOKED');
    const activePerm = relevantPerms.find(
      (p) => p.status === 'ACTIVE' && new Date(p.expiryDate) > now
    );

    if (!activePerm) {
      if (revokedPerm) {
        return {
          granted: false,
          reason: 'ACCESS DENIED: Patient has revoked permission.',
          code: 'ACCESS_DENIED_REVOKED',
        };
      }
      return {
        granted: false,
        reason: 'ACCESS DENIED: Permission duration has expired. New patient consent required.',
        code: 'ACCESS_DENIED_EXPIRED',
      };
    }

    // Check institution compatibility
    // In multi-institutional healthchain, institution must be a trusted peer
    const institutions = storageService.getInstitutions();
    const isInstitutionValid = institutions.some((i) => i.name === institution);
    if (!isInstitutionValid) {
      return {
        granted: false,
        reason: 'ACCESS DENIED: Request originates from an unrecognized or untrusted institution node.',
        code: 'ACCESS_DENIED_INSTITUTION_MISMATCH',
      };
    }

    // Check record-level access restrictions
    if (!activePerm.recordTypes.includes(requestedRecordType)) {
      return {
        granted: false,
        reason: `ACCESS DENIED: Requested medical record [${requestedRecordType}] is outside the approved permission scope. Doctor was only authorized for [${activePerm.recordTypes.join(', ')}].`,
        code: 'ACCESS_DENIED_RECORD_RESTRICTED',
      };
    }

    // Emergency permission check
    if (activePerm.isEmergency) {
      return {
        granted: true,
        reason: 'ACCESS GRANTED: Break-glass emergency authorization is active with mandatory audit telemetry.',
        code: 'ACCESS_GRANTED_EMERGENCY',
        permissionId: activePerm.id,
      };
    }

    // Granted standard access
    return {
      granted: true,
      reason: `ACCESS GRANTED: Patient consent is active and doctor belongs to authorized institution [${institution}].`,
      code: 'ACCESS_GRANTED',
      permissionId: activePerm.id,
    };
  },
};
