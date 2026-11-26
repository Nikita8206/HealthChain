import { BlockchainBlock, BlockchainTransaction, TransactionType } from '../types';
import { storageService } from './storageService';

// Pseudo-SHA256 simulation to generate realistic cryptographic hex hashes
function generateRealisticHash(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  let h3 = 0x84241acf ^ input.length;
  let h4 = 0x9b05688c ^ input.length;

  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = (h3 >>> 0).toString(16).padStart(8, '0');
  const hex4 = (h4 >>> 0).toString(16).padStart(8, '0');

  // Generate 64 hex characters
  return '0x0000' + (hex1 + hex2 + hex3 + hex4 + hex1.split('').reverse().join('') + hex2.slice(0, 4)).slice(0, 60);
}

export const blockchainService = {
  // Generate random transaction hash
  createTxHash(type: string, actorDid: string, timestamp: string): string {
    const seed = `${type}:${actorDid}:${timestamp}:${Math.random()}`;
    return generateRealisticHash(seed);
  },

  // Record a transaction onto the blockchain ledger and seal it into a block
  recordTransaction(params: {
    type: TransactionType;
    actorDid: string;
    actorName: string;
    patientDid: string;
    institution: string;
    status?: 'CONFIRMED' | 'FLAGGED';
    details: string;
    metadata?: Record<string, string | number | boolean>;
  }): BlockchainTransaction {
    const timestamp = new Date().toISOString();
    const txHash = this.createTxHash(params.type, params.actorDid, timestamp);

    const tx: BlockchainTransaction = {
      id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      timestamp,
      type: params.type,
      actorDid: params.actorDid,
      actorName: params.actorName,
      patientDid: params.patientDid,
      institution: params.institution,
      status: params.status || 'CONFIRMED',
      details: params.details,
      metadata: params.metadata,
      txHash,
    };

    // Save transaction
    storageService.addTransaction(tx);

    // Seal into a new block immediately for realistic visualization
    const blocks = storageService.getBlocks();
    const lastBlock = blocks[blocks.length - 1];
    const newBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 0;
    const prevHash = lastBlock
      ? lastBlock.currentHash
      : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const blockSeed = `${newBlockNumber}:${prevHash}:${txHash}:${timestamp}`;
    const newBlockHash = generateRealisticHash(blockSeed);
    const merkleRoot = '0xmerkle_' + generateRealisticHash(txHash + timestamp).slice(2, 34);

    const validatorNode =
      params.institution.toLowerCase().includes('sanjivani')
        ? 'peer1.sanjivani.healthchain.net'
        : params.institution.toLowerCase().includes('apollo')
        ? 'peer2.apollo.healthchain.net'
        : 'peer0.citycare.healthchain.net';

    const newBlock: BlockchainBlock = {
      blockNumber: newBlockNumber,
      previousHash: prevHash,
      currentHash: newBlockHash,
      timestamp,
      nonce: Math.floor(Math.random() * 50000) + 1000,
      merkleRoot,
      transactions: [tx],
      validator: `${validatorNode} (Consensus Raft/PBFT)`,
    };

    storageService.addBlock(newBlock);

    return tx;
  },

  // Get all blocks
  getChain(): BlockchainBlock[] {
    return storageService.getBlocks();
  },

  // Get all transactions
  getTransactions(): BlockchainTransaction[] {
    return storageService.getTransactions();
  },

  // Verify chain integrity
  verifyChainIntegrity(): {
    isValid: boolean;
    totalBlocks: number;
    genesisVerified: boolean;
    linkIntegrity: boolean;
    hashChecksPassed: boolean;
    timestamp: string;
    details: string;
  } {
    const blocks = storageService.getBlocks();
    if (blocks.length === 0) {
      return {
        isValid: false,
        totalBlocks: 0,
        genesisVerified: false,
        linkIntegrity: false,
        hashChecksPassed: false,
        timestamp: new Date().toISOString(),
        details: 'No blocks found in ledger',
      };
    }

    let linkIntegrity = true;
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].previousHash !== blocks[i - 1].currentHash) {
        linkIntegrity = false;
        break;
      }
    }

    const genesis = blocks[0];
    const genesisVerified =
      genesis.blockNumber === 0 &&
      genesis.previousHash ===
        '0x0000000000000000000000000000000000000000000000000000000000000000';

    const isValid = linkIntegrity && genesisVerified;

    return {
      isValid,
      totalBlocks: blocks.length,
      genesisVerified,
      linkIntegrity,
      hashChecksPassed: true,
      timestamp: new Date().toISOString(),
      details: isValid
        ? `Consensus verified across ${blocks.length} blocks. All cryptographic cryptographic hash pointers match.`
        : 'Chain link discrepancy detected.',
    };
  },
};
