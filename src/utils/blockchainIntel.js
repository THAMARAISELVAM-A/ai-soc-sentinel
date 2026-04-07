/**
 * Blockchain-Based Threat Intelligence Sharing
 * Decentralized, immutable threat data ledger
 */

// Simulated Blockchain for Threat Intelligence
export class ThreatIntelligenceChain {
  constructor() {
    this.chain = [];
    this.pendingThreats = [];
    this.nodes = new Set();
    this.difficulty = 4; // Proof of Work difficulty
    
    // Create genesis block
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: new Date().toISOString(),
      threats: [],
      previousHash: '0',
      hash: this.calculateHash(0, new Date().toISOString(), [], '0'),
      nonce: 0,
      validator: 'GENESIS'
    };
    this.chain.push(genesisBlock);
  }

  calculateHash(index, timestamp, threats, previousHash, nonce = 0) {
    const data = `${index}${timestamp}${JSON.stringify(threats)}${previousHash}${nonce}`;
    return this.sha256(data);
  }

  sha256(data) {
    // Simplified SHA-256 simulation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  // Add new threat to pending pool
  addThreat(threat) {
    const threatRecord = {
      id: this.generateThreatId(),
      timestamp: new Date().toISOString(),
      ...threat,
      verified: false,
      consensus: 0
    };
    
    this.pendingThreats.push(threatRecord);
    return threatRecord;
  }

  generateThreatId() {
    return `THREAT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Mine pending threats into a block
  minePendingThreats(validator) {
    if (this.pendingThreats.length === 0) return null;

    const lastBlock = this.chain[this.chain.length - 1];
    let nonce = 0;
    let hash = '';
    
    // Proof of Work
    do {
      nonce++;
      hash = this.calculateHash(
        this.chain.length,
        new Date().toISOString(),
        this.pendingThreats,
        lastBlock.hash,
        nonce
      );
    } while (!hash.startsWith('0'.repeat(this.difficulty)));

    const newBlock = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      threats: [...this.pendingThreats],
      previousHash: lastBlock.hash,
      hash,
      nonce,
      validator,
      proofOfWork: true
    };

    this.chain.push(newBlock);
    this.pendingThreats = [];
    
    return newBlock;
  }

  // Verify chain integrity
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify hash
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.threats,
        currentBlock.previousHash,
        currentBlock.nonce
      )) {
        return false;
      }

      // Verify chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  // Get threat by ID
  getThreat(threatId) {
    for (const block of this.chain) {
      const threat = block.threats.find(t => t.id === threatId);
      if (threat) return { threat, block: block.index };
    }
    return null;
  }

  // Get chain statistics
  getStats() {
    return {
      totalBlocks: this.chain.length,
      totalThreats: this.chain.reduce((sum, block) => sum + block.threats.length, 0),
      pendingThreats: this.pendingThreats.length,
      chainValid: this.isChainValid(),
      difficulty: this.difficulty,
      lastBlockTime: this.chain[this.chain.length - 1]?.timestamp
    };
  }
}

// Smart Contract for Automated Response
export class ResponsePlaybookContract {
  constructor() {
    this.playbooks = new Map();
    this.executions = [];
  }

  // Deploy automated response playbook
  deployPlaybook(playbook) {
    const playbookId = `PLAYBOOK-${Date.now()}`;
    this.playbooks.set(playbookId, {
      ...playbook,
      id: playbookId,
      deployedAt: new Date().toISOString(),
      active: true,
      executions: 0
    });
    return playbookId;
  }

  // Execute playbook based on threat conditions
  executePlaybook(threat) {
    const results = [];
    
    for (const [playbookId, playbook] of this.playbooks) {
      if (!playbook.active) continue;
      
      const conditionsMet = playbook.conditions.every(condition => {
        return this.evaluateCondition(condition, threat);
      });

      if (conditionsMet) {
        const execution = {
          playbookId,
          threatId: threat.id,
          executedAt: new Date().toISOString(),
          actions: playbook.actions.map(action => ({
            ...action,
            status: 'completed',
            result: `Action ${action.type} executed successfully`
          }))
        };
        
        this.executions.push(execution);
        results.push(execution);
        
        // Update playbook execution count
        const pb = this.playbooks.get(playbookId);
        pb.executions++;
      }
    }

    return results;
  }

  evaluateCondition(condition, threat) {
    const { field, operator, value } = condition;
    const threatValue = threat[field];

    switch (operator) {
      case 'equals': return threatValue === value;
      case 'greater_than': return threatValue > value;
      case 'less_than': return threatValue < value;
      case 'contains': return threatValue?.includes(value);
      case 'in': return value.includes(threatValue);
      default: return false;
    }
  }

  // Get execution history
  getExecutionHistory(limit = 10) {
    return this.executions.slice(-limit);
  }
}

// Decentralized Threat Sharing Network
export class ThreatSharingNetwork {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.peers = new Map();
    this.sharedThreats = [];
    this.reputation = 100;
  }

  // Connect to peer node
  connectPeer(peerId, endpoint) {
    this.peers.set(peerId, {
      id: peerId,
      endpoint,
      connectedAt: new Date().toISOString(),
      lastSync: null,
      threatsReceived: 0,
      reputation: 100
    });
  }

  // Share threat with network
  broadcastThreat(threat) {
    const sharedThreat = {
      ...threat,
      originNode: this.nodeId,
      sharedAt: new Date().toISOString(),
      verified: false,
      consensus: 0
    };

    this.sharedThreats.push(sharedThreat);
    
    // Simulate broadcast to peers
    for (const [peerId, peer] of this.peers) {
      peer.threatsReceived++;
      peer.lastSync = new Date().toISOString();
    }

    return sharedThreat;
  }

  // Verify threat through consensus
  verifyThreat(threatId, verification) {
    const threat = this.sharedThreats.find(t => t.id === threatId);
    if (threat) {
      threat.consensus++;
      threat.verified = threat.consensus >= Math.ceil(this.peers.size / 2);
      return threat.verified;
    }
    return false;
  }

  // Get network statistics
  getNetworkStats() {
    return {
      nodeId: this.nodeId,
      peerCount: this.peers.size,
      sharedThreats: this.sharedThreats.length,
      verifiedThreats: this.sharedThreats.filter(t => t.verified).length,
      reputation: this.reputation,
      activePeers: Array.from(this.peers.values()).filter(p => p.lastSync)
    };
  }
}

export default {
  ThreatIntelligenceChain,
  ResponsePlaybookContract,
  ThreatSharingNetwork
};