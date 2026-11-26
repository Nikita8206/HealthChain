import { DIDDocument, DIDIdentity } from '../types';
import { storageService } from './storageService';
import { blockchainService } from './blockchainService';

export const didService = {
  // Generate random 4-character hex ID
  generateRandomId(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  },

  // Create simulated public key
  generatePublicKey(): string {
    const chars = '0123456789abcdef';
    let key = '0x';
    for (let i = 0; i < 64; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  },

  // Generate new DID
  generateDID(
    type: 'Patient' | 'Doctor' | 'Administrator' | 'IoMT_Device',
    name: string,
    institution: string
  ): DIDIdentity {
    const typePrefix =
      type === 'Patient'
        ? 'patient'
        : type === 'Doctor'
        ? 'doctor'
        : type === 'Administrator'
        ? 'admin'
        : 'iomt';

    const suffix = this.generateRandomId();
    const did = `did:health:${typePrefix}:${suffix}`;
    const publicKey = this.generatePublicKey();
    const createdDate = new Date().toISOString();

    const services =
      type === 'Patient'
        ? ['EHR-DataVault', 'ConsentController', 'IoMT-Telemetry']
        : type === 'Doctor'
        ? ['ClinicalQueryGateway', 'AuthorizationPeer']
        : type === 'Administrator'
        ? ['GovernanceAuthority', 'AuditReview']
        : ['IoMT-TelemetryStream', 'EncryptedTelemetrySink'];

    const newIdentity: DIDIdentity = {
      did,
      name,
      type,
      institution,
      verificationStatus: 'PENDING',
      createdDate,
      publicKey,
      keyType: 'Ed25519VerificationKey2020',
      services,
    };

    storageService.addDID(newIdentity);

    // Record on blockchain
    blockchainService.recordTransaction({
      type: 'DID_CREATED',
      actorDid: did,
      actorName: name,
      patientDid: type === 'Patient' ? did : 'N/A',
      institution,
      details: `New decentralized identity [${did}] created and recorded on HealthChain ledger.`,
      metadata: { keyType: newIdentity.keyType },
    });

    storageService.addNotification({
      title: 'DID Minted',
      message: `Identity ${did} created with status PENDING verification.`,
      type: 'info',
    });

    return newIdentity;
  },

  // Verify DID
  verifyDID(didString: string): { verified: boolean; message: string; txHash?: string } {
    const dids = storageService.getDIDs();
    const target = dids.find((d) => d.did === didString);

    if (!target) {
      return { verified: false, message: 'DID not found in HealthChain registry.' };
    }

    storageService.updateDID(didString, { verificationStatus: 'VERIFIED' });

    // Record verification on blockchain
    const tx = blockchainService.recordTransaction({
      type: 'DID_VERIFIED',
      actorDid: target.did,
      actorName: target.name,
      patientDid: target.type === 'Patient' ? target.did : 'N/A',
      institution: target.institution,
      details: `Cryptographic proof and signature verified for ${target.did}. Consensus signed.`,
      metadata: { verificationMethod: 'Ed25519Signature2020', status: 'VERIFIED' },
    });

    storageService.addNotification({
      title: 'DID Verified',
      message: `Decentralized identity ${target.did} verified on-chain.`,
      type: 'success',
    });

    return {
      verified: true,
      message: `✓ DID ${target.did} verified successfully on blockchain.`,
      txHash: tx.txHash,
    };
  },

  // Build W3C compliant DID Document
  buildDIDDocument(identity: DIDIdentity): DIDDocument {
    const keyId = `${identity.did}#key-1`;
    return {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
      ],
      id: identity.did,
      verificationMethod: [
        {
          id: keyId,
          type: identity.keyType,
          controller: identity.did,
          publicKeyMultibase: `z${identity.publicKey.slice(2, 36)}`,
        },
      ],
      authentication: [keyId],
      assertionMethod: [keyId],
      service: identity.services.map((svc, idx) => ({
        id: `${identity.did}#service-${idx + 1}`,
        type: svc,
        serviceEndpoint: `https://${identity.institution.toLowerCase().replace(/[^a-z0-9]/g, '')}.healthchain.net/did/services/${svc.toLowerCase()}`,
      })),
      created: identity.createdDate,
      updated: new Date().toISOString(),
      proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: keyId,
        proofPurpose: 'assertionMethod',
        jws: `eyJhbGciOiJFZERTQSI...${identity.did.replace(/[^a-zA-Z0-9]/g, '')}`,
      },
    };
  },

  // Get all DIDs
  getAllDIDs(): DIDIdentity[] {
    return storageService.getDIDs();
  },
};
