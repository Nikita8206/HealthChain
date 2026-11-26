import {
  User,
  UserRole,
  EHRRecord,
  AccessRequest,
  Permission,
  BlockchainBlock,
  BlockchainTransaction,
  DIDIdentity,
  IoMTDevice,
  SecurityEvent,
  NotificationItem,
  Institution,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'healthchain_current_user',
  USERS: 'healthchain_users',
  EHR_RECORDS: 'healthchain_ehr_records',
  ACCESS_REQUESTS: 'healthchain_access_requests',
  PERMISSIONS: 'healthchain_permissions',
  BLOCKCHAIN: 'healthchain_blocks',
  TRANSACTIONS: 'healthchain_transactions',
  DIDS: 'healthchain_dids',
  IOMT_DEVICES: 'healthchain_iomt_devices',
  SECURITY_EVENTS: 'healthchain_security_events',
  NOTIFICATIONS: 'healthchain_notifications',
  INSTITUTIONS: 'healthchain_institutions',
  DEMO_STEP: 'healthchain_demo_step',
};

// Initial Fictional Data
export const INITIAL_USERS: User[] = [
  {
    id: 'user_patient_001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@patient.healthchain.org',
    role: 'patient',
    did: 'did:health:patient:001',
    institution: 'CityCare Hospital',
    title: 'Registered Patient',
  },
  {
    id: 'user_doctor_001',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@citycare.org',
    role: 'doctor',
    did: 'did:health:doctor:001',
    institution: 'CityCare Hospital',
    title: 'Senior Cardiologist & Internal Medicine',
    department: 'Cardiology & Metabolic Health',
  },
  {
    id: 'user_admin_001',
    name: 'Admin User',
    email: 'security.admin@healthchain.org',
    role: 'admin',
    did: 'did:health:admin:001',
    institution: 'CityCare Hospital & Network Governance',
    title: 'Healthcare DID & Cybersecurity Officer',
  },
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-01',
    name: 'CityCare Hospital',
    code: 'CCH-METRO',
    location: 'Metro Central District',
    didRegistryNode: 'peer0.citycare.healthchain.net',
    status: 'ACTIVE',
    doctorsCount: 48,
    patientsCount: 1250,
    trustScore: 99.4,
  },
  {
    id: 'inst-02',
    name: 'Sanjivani Medical Center',
    code: 'SMC-NORTH',
    location: 'North Medical Enclave',
    didRegistryNode: 'peer1.sanjivani.healthchain.net',
    status: 'PEER_CONNECTED',
    doctorsCount: 32,
    patientsCount: 890,
    trustScore: 98.7,
  },
  {
    id: 'inst-03',
    name: 'Apollo Health Center',
    code: 'AHC-SOUTH',
    location: 'Southern Healthcare Hub',
    didRegistryNode: 'peer2.apollo.healthchain.net',
    status: 'PEER_CONNECTED',
    doctorsCount: 65,
    patientsCount: 2100,
    trustScore: 99.1,
  },
  {
    id: 'inst-04',
    name: 'Rural Health Clinic',
    code: 'RHC-VALLEY',
    location: 'Eastern Valley Outreach',
    didRegistryNode: 'peer3.ruralhealth.healthchain.net',
    status: 'PEER_CONNECTED',
    doctorsCount: 14,
    patientsCount: 420,
    trustScore: 96.8,
  },
];

export const INITIAL_EHR_RECORDS: EHRRecord[] = [
  {
    id: 'ehr-rec-001',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Diagnosis',
    title: 'Primary Diagnosis: Type 2 Diabetes Mellitus & Prehypertension',
    hospital: 'CityCare Hospital',
    createdDate: '2026-03-10',
    accessLevel: 'Standard',
    status: 'Active',
    doctorDid: 'did:health:doctor:001',
    doctorName: 'Dr. Marcus Vance',
    data: {
      diagnosis: 'Type 2 Diabetes Mellitus (ICD-10 E11.9)',
      secondaryDiagnosis: 'Essential Prehypertension (I10)',
      bloodPressure: '128/82 mmHg',
      fastingBloodGlucose: '108 mg/dL',
      hba1c: '6.4%',
      bmi: '24.2',
    },
    clinicalNotes:
      'Patient exhibits stable glycemic metrics with lifestyle moderation and metformin therapy. Vital signs normotensive on rest.',
  },
  {
    id: 'ehr-rec-002',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Prescription',
    title: 'Active Medication Regimen',
    hospital: 'CityCare Hospital',
    createdDate: '2026-03-12',
    accessLevel: 'Standard',
    status: 'Active',
    doctorDid: 'did:health:doctor:001',
    doctorName: 'Dr. Marcus Vance',
    data: {
      medication1: 'Metformin Hydrochloride 500mg (Oral, Twice Daily with meals)',
      medication2: 'Lisinopril 5mg (Oral, Once Daily morning)',
      medication3: 'Vitamin D3 2000 IU (Oral, Daily)',
      refillsRemaining: '3 refills',
      pharmacy: 'CityCare Integrated Pharmacy',
    },
    clinicalNotes: 'Prescription valid for 90-day dispensing cycle. Kidney function panel checked prior to refill.',
  },
  {
    id: 'ehr-rec-003',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Laboratory Report',
    title: 'Comprehensive Metabolic Panel & Lipid Profile',
    hospital: 'CityCare Hospital',
    createdDate: '2026-04-02',
    accessLevel: 'Standard',
    status: 'Active',
    data: {
      fastingGlucose: '108 mg/dL (Normal: 70-99)',
      hba1c: '6.4 % (Target: < 7.0%)',
      totalCholesterol: '182 mg/dL',
      ldl: '104 mg/dL',
      hdl: '54 mg/dL',
      serumCreatinine: '0.88 mg/dL',
      egfr: '> 90 mL/min/1.73m²',
    },
    clinicalNotes: 'Renal panel unremarkable. HbA1c shows good adherence to dietary guidelines.',
  },
  {
    id: 'ehr-rec-004',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Allergy',
    title: 'Critical Allergy Warning: Penicillin & Beta-Lactam Class',
    hospital: 'CityCare Hospital',
    createdDate: '2025-11-15',
    accessLevel: 'Standard',
    status: 'Active',
    data: {
      allergen: 'Penicillin and Ampicillin derivatives',
      severity: 'Severe (Anaphylaxis Risk)',
      reactionType: 'Cutaneous urticaria, angioedema, bronchospasm',
      firstNoted: '2019 at emergency clinic',
    },
    clinicalNotes: 'CRITICAL: Strict avoidance of all beta-lactam antibiotics. Macrolides or fluoroquinolones advised as alternatives.',
  },
  {
    id: 'ehr-rec-005',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Treatment History',
    title: 'Previous Clinical Treatments & Hospital Visits',
    hospital: 'Sanjivani Medical Center',
    createdDate: '2025-08-20',
    accessLevel: 'Standard',
    status: 'Active',
    data: {
      procedure: 'Outpatient Cardiac Stress Echo & Holter Monitoring',
      facility: 'Sanjivani Medical Center Cardiology Dept',
      finding: 'Normal ejection fraction 62%, no exercise-induced ischemia',
      dischargeNotes: 'Cleared for moderate aerobic physical exercise',
    },
    clinicalNotes: 'Records federated across Sanjivani node via DID cross-institutional query.',
  },
  {
    id: 'ehr-rec-006',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Medical Notes',
    title: 'Attending Physician Consultation Notes',
    hospital: 'CityCare Hospital',
    createdDate: '2026-06-15',
    accessLevel: 'Confidential',
    status: 'Active',
    doctorDid: 'did:health:doctor:001',
    doctorName: 'Dr. Marcus Vance',
    data: {
      chiefComplaint: 'Routine 3-month metabolic follow-up',
      vitalsAtVisit: 'BP 128/82, HR 72, SpO2 98%, Wt 64kg',
      subjective: 'Patient reports feeling energetic, no hypoglycemia episodes.',
      plan: 'Continue current Metformin dose. IoMT CGM monitoring enabled.',
    },
    clinicalNotes: 'Encouraged continued sync with home continuous glucose monitor and BP cuff.',
  },
  {
    id: 'ehr-rec-007',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    recordType: 'Genetic Data',
    title: 'Pharmacogenomics Screen: CYP2C19 & SLCO1B1 Profile',
    hospital: 'Apollo Health Center',
    createdDate: '2025-04-18',
    accessLevel: 'Restricted',
    status: 'Active',
    data: {
      cyp2c19Metabolizer: 'Intermediate Metabolizer (*1/*2)',
      slco1b1Phenotype: 'Normal Function (T/T)',
      statinRisk: 'Standard myopathy risk profile',
      clinicalImplication: 'Requires explicit genetic-consent tier for external physician review.',
    },
    clinicalNotes: 'RESTRICTED GENOMIC DATA: Strict multi-party computation/consent authorization barrier required.',
  },
];

export const INITIAL_DIDS: DIDIdentity[] = [
  {
    did: 'did:health:patient:001',
    name: 'Sarah Jenkins',
    type: 'Patient',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2026-01-15T09:30:00Z',
    publicKey: '0x3a9b93c85f67a39d8924b1c28f910e53b4ca6d8e20f9a2bc1d84651379e4a3b8',
    keyType: 'Ed25519VerificationKey2020',
    services: ['EHR-DataVault', 'ConsentController', 'IoMT-Telemetry'],
  },
  {
    did: 'did:health:doctor:001',
    name: 'Dr. Marcus Vance',
    type: 'Doctor',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2025-11-20T14:15:00Z',
    publicKey: '0x81e9f42b36a18d99c43b59a0f4e3c89b781a2f64e29b5c3104e8d71239ab4211',
    keyType: 'Ed25519VerificationKey2020',
    services: ['ClinicalQueryGateway', 'EmergencyAuthorizationPeer'],
  },
  {
    did: 'did:health:admin:001',
    name: 'Admin User',
    type: 'Administrator',
    institution: 'CityCare Hospital & Network Governance',
    verificationStatus: 'VERIFIED',
    createdDate: '2025-09-01T08:00:00Z',
    publicKey: '0x0df294b15c8e317a94158b29c4172f3e8b914c2780e9a5c123498f7e1b539a2d',
    keyType: 'Ed25519VerificationKey2020',
    services: ['NetworkGovernance', 'AuditVerifier', 'SecurityMonitor'],
  },
  {
    did: 'did:health:iomt:bp001',
    name: 'Smart Blood Pressure Monitor (Omron V-10)',
    type: 'IoMT_Device',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2026-02-01T10:00:00Z',
    publicKey: '0x5c8e317a94158b29c4172f3e8b914c2780e9a5c123498f7e1b539a2d0df294b1',
    keyType: 'Ed25519VerificationKey2020',
    services: ['IoMT-TelemetryStream', 'EncryptedTelemetrySink'],
  },
  {
    did: 'did:health:iomt:cgm001',
    name: 'Continuous Glucose Monitor (Dexcom GSim)',
    type: 'IoMT_Device',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2026-02-10T11:30:00Z',
    publicKey: '0x7e1b539a2d0df294b15c8e317a94158b29c4172f3e8b914c2780e9a5c123498f',
    keyType: 'Ed25519VerificationKey2020',
    services: ['IoMT-TelemetryStream', 'RealtimeMetabolicAlerts'],
  },
  {
    did: 'did:health:iomt:ox001',
    name: 'Smart Pulse Oximeter (Wellue OxSim)',
    type: 'IoMT_Device',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2026-02-15T12:00:00Z',
    publicKey: '0x2780e9a5c123498f7e1b539a2d0df294b15c8e317a94158b29c4172f3e8b914c',
    keyType: 'Ed25519VerificationKey2020',
    services: ['IoMT-TelemetryStream'],
  },
  {
    did: 'did:health:iomt:ecg001',
    name: 'Smart ECG 6-Lead Patch (Kardia Sim)',
    type: 'IoMT_Device',
    institution: 'CityCare Hospital',
    verificationStatus: 'VERIFIED',
    createdDate: '2026-02-20T14:45:00Z',
    publicKey: '0x123498f7e1b539a2d0df294b15c8e317a94158b29c4172f3e8b914c2780e9a5c',
    keyType: 'Ed25519VerificationKey2020',
    services: ['IoMT-TelemetryStream', 'ArrhythmiaDetection'],
  },
];

export const INITIAL_IOMT_DEVICES: IoMTDevice[] = [
  {
    id: 'iomt-001',
    name: 'Smart Blood Pressure Monitor',
    did: 'did:health:iomt:bp001',
    type: 'Blood Pressure Monitor',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    institution: 'CityCare Hospital',
    status: 'ONLINE',
    battery: 92,
    lastUpdate: 'Just now',
    firmware: 'v2.4.1-sec',
    currentReading: {
      timestamp: '2026-09-20T15:05:00Z',
      bloodPressure: '128/82 mmHg',
      systolic: 128,
      diastolic: 82,
      heartRate: 72,
      isAbnormal: false,
    },
  },
  {
    id: 'iomt-002',
    name: 'Continuous Glucose Monitor (CGM)',
    did: 'did:health:iomt:cgm001',
    type: 'Continuous Glucose Monitor',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    institution: 'CityCare Hospital',
    status: 'ONLINE',
    battery: 85,
    lastUpdate: '1 min ago',
    firmware: 'v3.1.0-iot',
    currentReading: {
      timestamp: '2026-09-20T15:04:00Z',
      glucose: 108,
      isAbnormal: false,
    },
  },
  {
    id: 'iomt-003',
    name: 'Smart Pulse Oximeter',
    did: 'did:health:iomt:ox001',
    type: 'Pulse Oximeter',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    institution: 'CityCare Hospital',
    status: 'ONLINE',
    battery: 78,
    lastUpdate: '2 mins ago',
    firmware: 'v1.8.3',
    currentReading: {
      timestamp: '2026-09-20T15:03:00Z',
      spO2: 98,
      heartRate: 72,
      isAbnormal: false,
    },
  },
  {
    id: 'iomt-004',
    name: 'Smart ECG Monitor',
    did: 'did:health:iomt:ecg001',
    type: 'Smart ECG',
    patientDid: 'did:health:patient:001',
    patientName: 'Sarah Jenkins',
    institution: 'CityCare Hospital',
    status: 'ONLINE',
    battery: 95,
    lastUpdate: 'Just now',
    firmware: 'v4.0.2-aes',
    currentReading: {
      timestamp: '2026-09-20T15:05:10Z',
      heartRate: 72,
      ecgStatus: 'Normal Sinus Rhythm',
      isAbnormal: false,
    },
  },
];

export const INITIAL_TRANSACTIONS: BlockchainTransaction[] = [
  {
    id: 'tx-001',
    timestamp: '2026-01-15T09:30:12Z',
    type: 'DID_CREATED',
    actorDid: 'did:health:patient:001',
    actorName: 'Sarah Jenkins',
    patientDid: 'did:health:patient:001',
    institution: 'CityCare Hospital',
    status: 'CONFIRMED',
    details: 'Decentralized Identity minted and anchored to health state root.',
    txHash: '0x8a72c4f91d3e876a5b42c90f8e123ab47d5e90c1f2468abce782194bbcd9201f',
  },
  {
    id: 'tx-002',
    timestamp: '2026-01-15T09:35:44Z',
    type: 'DID_VERIFIED',
    actorDid: 'did:health:patient:001',
    actorName: 'Sarah Jenkins',
    patientDid: 'did:health:patient:001',
    institution: 'CityCare Hospital',
    status: 'CONFIRMED',
    details: 'Zero-knowledge cryptographic signature verification confirmed on peer consensus.',
    txHash: '0x3f1e9c8a7b5d4e2098f12a34bc567890ef1234567890abcdef1234567890abcd',
  },
  {
    id: 'tx-003',
    timestamp: '2026-02-01T10:05:00Z',
    type: 'DID_CREATED',
    actorDid: 'did:health:iomt:bp001',
    actorName: 'Smart BP Monitor',
    patientDid: 'did:health:patient:001',
    institution: 'CityCare Hospital',
    status: 'CONFIRMED',
    details: 'IoMT hardware identity provisioned with TLS-ECDSA certificate anchoring.',
    txHash: '0x9a8b7c6d5e4f32109876543210abcdef0123456789abcdef0123456789abcdef',
  },
];

export const INITIAL_BLOCKS: BlockchainBlock[] = [
  {
    blockNumber: 0,
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '0x0000a4b89c72e1f98d5c4b3a201f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a10',
    timestamp: '2026-01-01T00:00:00Z',
    nonce: 10429,
    merkleRoot: '0xgenesis_merkle_root_healthchain_core_ledger_v1',
    validator: 'peer0.citycare.healthchain.net (Endorser Node)',
    transactions: [INITIAL_TRANSACTIONS[0]],
  },
  {
    blockNumber: 1,
    previousHash: '0x0000a4b89c72e1f98d5c4b3a201f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a10',
    currentHash: '0x0000f218c9a3d4e7b890123456789abcdef0123456789abcdef0123456789abcd',
    timestamp: '2026-01-15T09:40:00Z',
    nonce: 28410,
    merkleRoot: '0xmerkle_root_did_verification_bundle_001',
    validator: 'peer1.sanjivani.healthchain.net (Endorser Node)',
    transactions: [INITIAL_TRANSACTIONS[1]],
  },
  {
    blockNumber: 2,
    previousHash: '0x0000f218c9a3d4e7b890123456789abcdef0123456789abcdef0123456789abcd',
    currentHash: '0x0000c871d5b3a9e204918273645abcdef0123456789abcdef0123456789abcdef',
    timestamp: '2026-02-01T10:10:00Z',
    nonce: 19854,
    merkleRoot: '0xmerkle_root_iomt_provisioning_ledger_002',
    validator: 'peer2.apollo.healthchain.net (Orderer Node)',
    transactions: [INITIAL_TRANSACTIONS[2]],
  },
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-001',
    timestamp: '2026-03-01T14:20:00Z',
    type: 'INTEGRITY_CHECK',
    severity: 'LOW',
    actorDid: 'did:health:admin:001',
    targetDid: 'ALL_NODES',
    institution: 'CityCare Hospital',
    description: 'Scheduled multi-institution consensus audit passed. 4 of 4 peers in sync.',
    actionTaken: 'Consensus verified, no anomalies detected.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    timestamp: '2026-09-20T14:50:00Z',
    title: 'HealthChain Network Active',
    message: 'Decentralized identity registered & verified across 4 health network nodes.',
    type: 'success',
    read: false,
  },
];

// Helper: Custom Event Bus to keep React components reactive
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export function subscribeToStorage(callback: StorageListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners(): void {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch {
      // safe fallback
    }
  });
}

// Storage helpers
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

// Storage Service API
export const storageService = {
  // Current user
  getCurrentUser(): User {
    return getFromStorage<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user: User): void {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },
  switchRole(role: UserRole): User {
    const user =
      this.getUserByRole(role) ||
      INITIAL_USERS.find((u) => u.role === role) ||
      INITIAL_USERS[0];
    this.setCurrentUser(user);
    return user;
  },

  // All users
  getUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  getUserByRole(role: string): User | undefined {
    return this.getUsers().find((u) => u.role === role);
  },
  getUserByDid(did: string): User | undefined {
    return this.getUsers().find((u) => u.did === did);
  },

  // Institutions
  getInstitutions(): Institution[] {
    return getFromStorage<Institution[]>(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
  },

  // EHR Records
  getEHRRecords(): EHRRecord[] {
    return getFromStorage<EHRRecord[]>(STORAGE_KEYS.EHR_RECORDS, INITIAL_EHR_RECORDS);
  },
  getEHRRecordsForPatient(patientDid: string): EHRRecord[] {
    return this.getEHRRecords().filter((rec) => rec.patientDid === patientDid);
  },
  addEHRRecord(record: EHRRecord): void {
    const records = this.getEHRRecords();
    records.unshift(record);
    setToStorage(STORAGE_KEYS.EHR_RECORDS, records);
  },

  // Access Requests
  getAccessRequests(): AccessRequest[] {
    return getFromStorage<AccessRequest[]>(STORAGE_KEYS.ACCESS_REQUESTS, []);
  },
  addAccessRequest(req: AccessRequest): void {
    const requests = this.getAccessRequests();
    requests.unshift(req);
    setToStorage(STORAGE_KEYS.ACCESS_REQUESTS, requests);
  },
  updateAccessRequest(reqId: string, updates: Partial<AccessRequest>): void {
    const requests = this.getAccessRequests().map((req) =>
      req.id === reqId ? { ...req, ...updates } : req
    );
    setToStorage(STORAGE_KEYS.ACCESS_REQUESTS, requests);
  },

  // Permissions
  getPermissions(): Permission[] {
    return getFromStorage<Permission[]>(STORAGE_KEYS.PERMISSIONS, []);
  },
  addPermission(perm: Permission): void {
    const perms = this.getPermissions();
    perms.unshift(perm);
    setToStorage(STORAGE_KEYS.PERMISSIONS, perms);
  },
  updatePermission(permId: string, updates: Partial<Permission>): void {
    const perms = this.getPermissions().map((p) =>
      p.id === permId ? { ...p, ...updates } : p
    );
    setToStorage(STORAGE_KEYS.PERMISSIONS, perms);
  },

  // Blockchain
  getBlocks(): BlockchainBlock[] {
    return getFromStorage<BlockchainBlock[]>(STORAGE_KEYS.BLOCKCHAIN, INITIAL_BLOCKS);
  },
  addBlock(block: BlockchainBlock): void {
    const blocks = this.getBlocks();
    blocks.push(block);
    setToStorage(STORAGE_KEYS.BLOCKCHAIN, blocks);
  },
  getTransactions(): BlockchainTransaction[] {
    return getFromStorage<BlockchainTransaction[]>(
      STORAGE_KEYS.TRANSACTIONS,
      INITIAL_TRANSACTIONS
    );
  },
  addTransaction(tx: BlockchainTransaction): void {
    const txs = this.getTransactions();
    txs.unshift(tx);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, txs);
  },

  // DIDs
  getDIDs(): DIDIdentity[] {
    return getFromStorage<DIDIdentity[]>(STORAGE_KEYS.DIDS, INITIAL_DIDS);
  },
  addDID(did: DIDIdentity): void {
    const dids = this.getDIDs();
    dids.unshift(did);
    setToStorage(STORAGE_KEYS.DIDS, dids);
  },
  updateDID(didString: string, updates: Partial<DIDIdentity>): void {
    const dids = this.getDIDs().map((d) =>
      d.did === didString ? { ...d, ...updates } : d
    );
    setToStorage(STORAGE_KEYS.DIDS, dids);
  },

  // IoMT
  getIoMTDevices(): IoMTDevice[] {
    return getFromStorage<IoMTDevice[]>(STORAGE_KEYS.IOMT_DEVICES, INITIAL_IOMT_DEVICES);
  },
  updateIoMTDevice(id: string, updates: Partial<IoMTDevice>): void {
    const devices = this.getIoMTDevices().map((dev) =>
      dev.id === id ? { ...dev, ...updates } : dev
    );
    setToStorage(STORAGE_KEYS.IOMT_DEVICES, devices);
  },

  // Security Events
  getSecurityEvents(): SecurityEvent[] {
    return getFromStorage<SecurityEvent[]>(
      STORAGE_KEYS.SECURITY_EVENTS,
      INITIAL_SECURITY_EVENTS
    );
  },
  addSecurityEvent(event: SecurityEvent): void {
    const events = this.getSecurityEvents();
    events.unshift(event);
    setToStorage(STORAGE_KEYS.SECURITY_EVENTS, events);
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getFromStorage<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
  },
  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      read: false,
    };
    notifs.unshift(newNotif);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs.slice(0, 30));
  },
  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Demo step
  getDemoStep(): number {
    return getFromStorage<number>(STORAGE_KEYS.DEMO_STEP, 1);
  },
  setDemoStep(step: number): void {
    setToStorage(STORAGE_KEYS.DEMO_STEP, step);
  },

  // Reset to initial
  resetAll(): void {
    this.resetDemoData();
  },
  resetDemoData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.EHR_RECORDS);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_REQUESTS);
      localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
      localStorage.removeItem(STORAGE_KEYS.BLOCKCHAIN);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.DIDS);
      localStorage.removeItem(STORAGE_KEYS.IOMT_DEVICES);
      localStorage.removeItem(STORAGE_KEYS.SECURITY_EVENTS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.INSTITUTIONS);
      localStorage.removeItem(STORAGE_KEYS.DEMO_STEP);

      // Re-seed defaults
      setToStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
      setToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      setToStorage(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
      setToStorage(STORAGE_KEYS.EHR_RECORDS, INITIAL_EHR_RECORDS);
      setToStorage(STORAGE_KEYS.DIDS, INITIAL_DIDS);
      setToStorage(STORAGE_KEYS.IOMT_DEVICES, INITIAL_IOMT_DEVICES);
      setToStorage(STORAGE_KEYS.BLOCKCHAIN, INITIAL_BLOCKS);
      setToStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
      setToStorage(STORAGE_KEYS.SECURITY_EVENTS, INITIAL_SECURITY_EVENTS);
      setToStorage(STORAGE_KEYS.NOTIFICATIONS, [
        {
          id: 'notif-reset',
          timestamp: new Date().toISOString(),
          title: 'System State Reset',
          message: 'Default fictional medical records, DIDs, and IoMT telemetry restored.',
          type: 'info',
          read: false,
        },
      ]);
      setToStorage(STORAGE_KEYS.DEMO_STEP, 1);

      notifyListeners();
    } catch (err) {
      console.error('Reset error:', err);
    }
  },
};
