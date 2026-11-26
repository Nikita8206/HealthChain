import { EHRRecord, EHRRecordType } from '../types';
import { storageService } from './storageService';
import { authorizationService } from './authorizationService';
import { blockchainService } from './blockchainService';

export const ehrService = {
  // Get all EHR records for a patient (when viewed by patient or admin)
  getRecordsForPatient(patientDid: string): EHRRecord[] {
    return storageService.getEHRRecordsForPatient(patientDid);
  },

  // Get single EHR record with authorization verification
  getRecordWithAuthorization(params: {
    recordId: string;
    doctorDid: string;
    doctorName: string;
    institution: string;
  }): {
    success: boolean;
    record?: EHRRecord;
    reason: string;
    authCode: string;
  } {
    const records = storageService.getEHRRecords();
    const record = records.find((r) => r.id === params.recordId);

    if (!record) {
      return {
        success: false,
        reason: 'Requested electronic health record not found in system.',
        authCode: 'NOT_FOUND',
      };
    }

    // Evaluate dynamic access
    const auth = authorizationService.evaluateAccess({
      doctorDid: params.doctorDid,
      doctorName: params.doctorName,
      patientDid: record.patientDid,
      requestedRecordType: record.recordType,
      institution: params.institution,
    });

    if (!auth.granted) {
      // Create blockchain audit event: EHR_ACCESS_DENIED
      const tx = blockchainService.recordTransaction({
        type: 'EHR_ACCESS_DENIED',
        actorDid: params.doctorDid,
        actorName: params.doctorName,
        patientDid: record.patientDid,
        institution: params.institution,
        status: 'FLAGGED',
        details: `Access DENIED to ${params.doctorName} for record [${record.recordType}: ${record.title}]. ${auth.reason}`,
        metadata: {
          recordId: record.id,
          recordType: record.recordType,
          reasonCode: auth.code,
        },
      });

      // Record security event
      storageService.addSecurityEvent({
        id: 'sec-ehr-denied-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'EHR_ACCESS_DENIED',
        severity: record.recordType === 'Genetic Data' ? 'HIGH' : 'MEDIUM',
        actorDid: params.doctorDid,
        targetDid: record.patientDid,
        institution: params.institution,
        description: `Unauthorized attempt to read [${record.recordType}] record by ${params.doctorName} (${params.institution}). Blocked by dynamic access policy.`,
        actionTaken: 'EHR access blocked. Security event logged to blockchain ledger.',
      });

      storageService.addNotification({
        title: 'Unauthorized EHR Access Blocked',
        message: `Attempt by ${params.doctorName} to access ${record.recordType} was blocked.`,
        type: 'error',
      });

      return {
        success: false,
        reason: auth.reason,
        authCode: auth.code,
      };
    }

    // Access granted! Record EHR_ACCESSED on blockchain
    blockchainService.recordTransaction({
      type: 'EHR_ACCESSED',
      actorDid: params.doctorDid,
      actorName: params.doctorName,
      patientDid: record.patientDid,
      institution: params.institution,
      status: 'CONFIRMED',
      details: `Physician ${params.doctorName} accessed authorized record [${record.recordType} - ${record.title}].`,
      metadata: {
        recordId: record.id,
        recordType: record.recordType,
        permissionId: auth.permissionId || 'DIRECT_CONSENT',
      },
    });

    return {
      success: true,
      record,
      reason: auth.reason,
      authCode: auth.code,
    };
  },

  // Add new EHR record
  createRecord(params: {
    patientDid: string;
    patientName: string;
    recordType: EHRRecordType;
    title: string;
    hospital: string;
    accessLevel: 'Standard' | 'Confidential' | 'Restricted';
    data: Record<string, string | number | boolean | string[]>;
    clinicalNotes: string;
    doctorDid?: string;
    doctorName?: string;
  }): EHRRecord {
    const newRecord: EHRRecord = {
      id: 'ehr-rec-' + Date.now(),
      patientDid: params.patientDid,
      patientName: params.patientName,
      recordType: params.recordType,
      title: params.title,
      hospital: params.hospital,
      createdDate: new Date().toISOString().split('T')[0],
      accessLevel: params.accessLevel,
      status: 'Active',
      doctorDid: params.doctorDid,
      doctorName: params.doctorName,
      data: params.data,
      clinicalNotes: params.clinicalNotes,
    };

    storageService.addEHRRecord(newRecord);
    return newRecord;
  },
};
