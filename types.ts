export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  did: string;
  institution: string;
  title?: string;
  department?: string;
  avatar?: string;
}

export type EHRRecordType =
  | 'Diagnosis'
  | 'Prescription'
  | 'Laboratory Report'
  | 'Allergy'
  | 'Treatment History'
  | 'Medical Notes'
  | 'Genetic Data';

export interface EHRRecord {
  id: string;
  patientDid: string;
  patientName: string;
  recordType: EHRRecordType;
  title: string;
  hospital: string;
  createdDate: string;
  accessLevel: 'Standard' | 'Confidential' | 'Restricted';
  status: 'Active' | 'Archived';
  doctorDid?: string;
  doctorName?: string;
  data: Record<string, string | number | boolean | string[]>;
  clinicalNotes: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';

export interface AccessRequest {
  id: string;
  doctorDid: string;
  doctorName: string;
  patientDid: string;
  patientName: string;
  institution: string;
  requestedRecords: EHRRecordType[];
  purpose: string;
  accessDurationHours: number;
  requestTimestamp: string;
  status: RequestStatus;
  isEmergency?: boolean;
  emergencyReason?: string;
  responseTimestamp?: string;
  transactionHash?: string;
}

export interface Permission {
  id: string;
  requestId: string;
  doctorDid: string;
  doctorName: string;
  patientDid: string;
  patientName: string;
  institution: string;
  recordTypes: EHRRecordType[];
  permissionLevel: 'READ' | 'READ_WRITE';
  grantedDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  isEmergency?: boolean;
  revokedDate?: string;
  transactionHash: string;
}

export type TransactionType =
  | 'DID_CREATED'
  | 'DID_VERIFIED'
  | 'ACCESS_REQUESTED'
  | 'ACCESS_APPROVED'
  | 'ACCESS_REJECTED'
  | 'ACCESS_REVOKED'
  | 'EHR_ACCESSED'
  | 'EHR_ACCESS_DENIED'
  | 'EMERGENCY_ACCESS'
  | 'IOMT_ALERT';

export interface BlockchainTransaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  actorDid: string;
  actorName: string;
  patientDid: string;
  institution: string;
  status: 'CONFIRMED' | 'FLAGGED';
  details: string;
  metadata?: Record<string, string | number | boolean>;
  txHash: string;
}

export interface BlockchainBlock {
  blockNumber: number;
  previousHash: string;
  currentHash: string;
  timestamp: string;
  nonce: number;
  merkleRoot: string;
  transactions: BlockchainTransaction[];
  validator: string;
}

export interface DIDIdentity {
  did: string;
  name: string;
  type: 'Patient' | 'Doctor' | 'Administrator' | 'IoMT_Device';
  institution: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REVOKED';
  createdDate: string;
  publicKey: string;
  keyType: 'Ed25519VerificationKey2020' | 'EcdsaSecp256k1VerificationKey2019';
  services: string[];
}

export interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }[];
  authentication: string[];
  assertionMethod: string[];
  service: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
  created: string;
  updated: string;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface IoMTReading {
  timestamp: string;
  bloodPressure?: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  spO2?: number;
  glucose?: number;
  ecgStatus?: 'Normal Sinus Rhythm' | 'Sinus Tachycardia' | 'Arrhythmia Detected';
  isAbnormal?: boolean;
  anomalyDescription?: string;
}

export interface IoMTDevice {
  id: string;
  name: string;
  did: string;
  type: 'Blood Pressure Monitor' | 'Continuous Glucose Monitor' | 'Pulse Oximeter' | 'Smart ECG';
  patientDid: string;
  patientName: string;
  institution: string;
  status: 'ONLINE' | 'STANDBY' | 'WARNING';
  battery: number;
  lastUpdate: string;
  currentReading: IoMTReading;
  firmware: string;
}

export type SecurityEventType =
  | 'UNAUTHORIZED_ACCESS'
  | 'EHR_ACCESS_DENIED'
  | 'PERMISSION_REVOKED'
  | 'IOMT_ANOMALY'
  | 'EMERGENCY_ACCESS'
  | 'DID_VERIFICATION_FAIL'
  | 'INTEGRITY_CHECK';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actorDid: string;
  targetDid: string;
  institution: string;
  description: string;
  actionTaken: string;
}

export interface AuthorizationResult {
  granted: boolean;
  reason: string;
  code:
    | 'ACCESS_GRANTED'
    | 'ACCESS_DENIED_NO_CONSENT'
    | 'ACCESS_DENIED_RECORD_RESTRICTED'
    | 'ACCESS_DENIED_EXPIRED'
    | 'ACCESS_DENIED_REVOKED'
    | 'ACCESS_DENIED_INSTITUTION_MISMATCH'
    | 'ACCESS_DENIED_UNAUTHENTICATED'
    | 'ACCESS_GRANTED_EMERGENCY';
  permissionId?: string;
  auditTxHash?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionRoute?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  location: string;
  didRegistryNode: string;
  status: 'ACTIVE' | 'PEER_CONNECTED';
  doctorsCount: number;
  patientsCount: number;
  trustScore: number;
}
