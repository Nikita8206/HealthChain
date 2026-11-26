# HealthChain — Decentralized Identity & Dynamic Access Management for Smart Healthcare

HealthChain is a **final-year academic prototype** for exploring decentralized identity (DID), patient-controlled access/consent, electronic health records (EHR), IoMT telemetry, emergency access, multi-institution workflows, and an auditable blockchain-inspired ledger for healthcare.

> **Implementation note:** This repository is a frontend/prototype implementation. The blockchain ledger, DID cryptographic operations, consensus/validator behavior, and IoMT telemetry are currently simulated in the application for academic demonstration. It is **not** a production healthcare system and should not be used with real patient data.

## Project objectives

- Demonstrate decentralized identity concepts for patients, doctors, administrators, and IoMT devices.
- Demonstrate fine-grained patient consent and dynamic access control.
- Demonstrate EHR sharing workflows across multiple healthcare institutions.
- Demonstrate IoMT vital monitoring and anomaly scenarios.
- Demonstrate emergency “Break-Glass” access with audit tracking.
- Visualize an auditable, blockchain-inspired transaction and block ledger.

## Main modules

- **Patient Dashboard** — identity, EHR summary, consent, access requests, and ledger activity.
- **Decentralized ID (DID)** — DID creation, verification, DID document visualization, and identity management.
- **Electronic Health Records** — diagnosis, prescriptions, laboratory reports, treatment history, allergies, and clinical notes.
- **Access & Consent Control** — doctor access requests, approval/rejection, permissions, and revocation.
- **Emergency Break-Glass** — emergency access workflow with audit events.
- **IoMT Telemetry & Vitals** — simulated heart rate, blood pressure, glucose, SpO2, ECG, and anomaly scenarios.
- **Blockchain Ledger** — simulated transactions, blocks, hashes, validator information, and integrity checks.
- **Cybersecurity Audit** — security/audit event visualization.
- **Multi-Institutions** — demonstration of cross-institution healthcare workflows.

## Technology stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Browser local storage for prototype persistence

## Run locally

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (the project is configured for port `3000`).

### Production build

```bash
npm run build
nnpm run preview
```

### Type check

```bash
npm run lint
```

## Architecture overview

```text
React UI
   │
   ├── DID Management
   ├── EHR Records
   ├── Access & Consent
   ├── Emergency Access
   ├── IoMT Monitoring
   ├── Security Audit
   └── Multi-Institution Views
          │
          ▼
   Application Services
          │
          ├── DID Service
          ├── Authorization Service
          ├── EHR Service
          ├── IoMT Service
          ├── Blockchain Service (simulation)
          └── Storage Service
          │
          ▼
   Browser Local Storage
```

## Academic scope and limitations

This project is intended to demonstrate the **concept and workflow** described in the final-year project proposal. The current implementation uses local browser storage and simulated cryptographic/ledger behavior rather than a live distributed blockchain network or real medical-device infrastructure.

For a production implementation, the prototype would need, among other things, a real permissioned blockchain network (for example, Hyperledger Fabric), real DID/Verifiable Credential infrastructure, secure key management, authenticated backend services, real IoMT device integration, encryption, regulatory/privacy controls, and security testing.

## Project information

**Project:** Blockchain-Based Decentralized Identity and Dynamic Access Management System for Multi-Institutional Smart Healthcare and IoMT

**System:** HealthChain

**Developed by:** Nikita Nawale

**Program:** B.Tech — Computer Science Engineering (Cybersecurity)

**University:** Sanjivani University, Kopargaon

**Project Guide:** Mr. Sudhanshu Verma

## Disclaimer

This software is an academic prototype. All patient records, identities, institutions, telemetry values, and transactions displayed by the application are demonstration data. Do not use it for diagnosis, treatment, clinical decision-making, or storage of real patient information.
