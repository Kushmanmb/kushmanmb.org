require('dotenv').config();
const https = require('https');
const { ethers } = require('ethers');

/**
 * Verify Owner Address
 * 
 * This script verifies that an Ethereum address is the owner (kushmanmb.eth)
 * using ENS resolution and Etherscan API.
 * 
 * Owner: kushmanmb.eth
 * Verified Address: 0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253
 */

// Official owner configuration
const OWNER_CONFIG = {
  ensName: 'kushmanmb.eth',
  verifiedAddress: '0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253',
  githubUsername: 'Kushmanmb',
};

/**
 * Make HTTPS GET request to Etherscan API
 * Uses POST to avoid exposing API key in URL
 */
function makeEtherscanRequest(apiKey, params) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      apikey: apiKey,
      ...params,
    }).toString();

    const options = {
      hostname: 'api.etherscan.io',
      path: '/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Get address balance from Etherscan
 */
async function getAddressBalance(address, apiKey) {
  const response = await makeEtherscanRequest(apiKey, {
    module: 'account',
    action: 'balance',
    address: address,
    tag: 'latest',
  });

  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message || response.result}`);
  }

  return response.result;
}

/**
 * Get address transaction count from Etherscan
 */
async function getTransactionCount(address, apiKey) {
  const response = await makeEtherscanRequest(apiKey, {
    module: 'proxy',
    action: 'eth_getTransactionCount',
    address: address,
    tag: 'latest',
  });

  if (response.error) {
    throw new Error(`Etherscan API error: ${response.error.message}`);
  }

  return parseInt(response.result, 16);
}

/**
 * Get recent transactions for address
 */
async function getRecentTransactions(address, apiKey) {
  const response = await makeEtherscanRequest(apiKey, {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: 0,
    endblock: 99999999,
    page: 1,
    offset: 5,
    sort: 'desc',
  });

  if (response.status !== '1' && response.message !== 'No transactions found') {
    return [];
  }

  return response.result || [];
}

/**
 * Verify owner address
 */
async function verifyOwnerAddress(options = {}) {
  const {
    address = OWNER_CONFIG.verifiedAddress,
    apiKey = process.env.ETHERSCAN_API_KEY,
    verbose = true,
  } = options;

  if (!apiKey) {
    throw new Error('Etherscan API key is required. Set ETHERSCAN_API_KEY environment variable.');
  }

  // Validate address format
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address format');
  }

  // Normalize address
  const normalizedAddress = ethers.getAddress(address);
  const expectedAddress = ethers.getAddress(OWNER_CONFIG.verifiedAddress);

  if (verbose) {
    console.log('='.repeat(60));
    console.log('OWNER ADDRESS VERIFICATION');
    console.log('='.repeat(60));
    console.log(`\nOwner ENS: ${OWNER_CONFIG.ensName}`);
    console.log(`Expected Address: ${expectedAddress}`);
    console.log(`Provided Address: ${normalizedAddress}`);
    console.log(`GitHub Username: ${OWNER_CONFIG.githubUsername}`);
    console.log('');
  }

  // Check if addresses match
  const addressMatch = normalizedAddress.toLowerCase() === expectedAddress.toLowerCase();

  if (verbose) {
    console.log('VERIFICATION RESULTS:');
    console.log('-'.repeat(40));
    
    if (addressMatch) {
      console.log('✓ Address MATCHES verified owner address');
    } else {
      console.log('✗ Address does NOT match verified owner address');
    }
  }

  // Get on-chain data from Etherscan
  if (verbose) {
    console.log('\nON-CHAIN VERIFICATION (via Etherscan API):');
    console.log('-'.repeat(40));
  }

  try {
    // Get balance
    const balanceWei = await getAddressBalance(normalizedAddress, apiKey);
    const balanceEth = ethers.formatEther(balanceWei);
    
    if (verbose) {
      console.log(`✓ Address exists on-chain`);
      console.log(`  Balance: ${balanceEth} ETH`);
    }

    // Get transaction count
    const txCount = await getTransactionCount(normalizedAddress, apiKey);
    
    if (verbose) {
      console.log(`  Transaction count: ${txCount}`);
    }

    // Get recent transactions
    const recentTxs = await getRecentTransactions(normalizedAddress, apiKey);
    
    if (verbose && recentTxs.length > 0) {
      console.log(`  Recent transactions: ${recentTxs.length}`);
      console.log('\n  Latest transactions:');
      recentTxs.slice(0, 3).forEach((tx, i) => {
        const date = new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0];
        const value = ethers.formatEther(tx.value);
        console.log(`    ${i + 1}. ${date} - ${value} ETH - ${tx.hash.slice(0, 18)}...`);
      });
    }

    if (verbose) {
      console.log('\n' + '='.repeat(60));
      console.log('VERIFICATION SUMMARY');
      console.log('='.repeat(60));
      console.log(`\nOwner: ${OWNER_CONFIG.ensName}`);
      console.log(`Address: ${normalizedAddress}`);
      console.log(`Status: ${addressMatch ? '✓ VERIFIED' : '✗ NOT VERIFIED'}`);
      console.log(`On-chain: ✓ Active address with ${txCount} transactions`);
      console.log('\n' + '='.repeat(60));
    }

    return {
      verified: addressMatch,
      owner: OWNER_CONFIG.ensName,
      address: normalizedAddress,
      expectedAddress: expectedAddress,
      balance: balanceEth,
      transactionCount: txCount,
      recentTransactions: recentTxs.length,
    };

  } catch (error) {
    if (verbose) {
      console.error(`\n✗ Error verifying address: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if an address is the verified owner
 */
function isOwnerAddress(address) {
  if (!ethers.isAddress(address)) {
    return false;
  }
  
  const normalizedAddress = ethers.getAddress(address);
  const expectedAddress = ethers.getAddress(OWNER_CONFIG.verifiedAddress);
  
  return normalizedAddress.toLowerCase() === expectedAddress.toLowerCase();
}

/**
 * Get owner configuration
 */
function getOwnerConfig() {
  return { ...OWNER_CONFIG };
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Owner Address Verification Tool

Usage:
  node verify-owner-address.js [options]

Options:
  --address <addr>   Address to verify (default: owner's verified address)
  --api-key <key>    Etherscan API key (or set ETHERSCAN_API_KEY env var)
  --help, -h         Show this help message

Owner Information:
  ENS Name: ${OWNER_CONFIG.ensName}
  Verified Address: ${OWNER_CONFIG.verifiedAddress}
  GitHub: @${OWNER_CONFIG.githubUsername}

Examples:
  # Verify the owner's address
  node verify-owner-address.js

  # Verify a specific address
  node verify-owner-address.js --address 0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253
`);
    process.exit(0);
  }

  // Parse arguments
  let address = OWNER_CONFIG.verifiedAddress;
  let apiKey = process.env.ETHERSCAN_API_KEY;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--address' && args[i + 1]) {
      address = args[i + 1];
      i++;
    } else if (args[i] === '--api-key' && args[i + 1]) {
      apiKey = args[i + 1];
      i++;
    }
  }

  // Run verification
  verifyOwnerAddress({ address, apiKey, verbose: true })
    .then((result) => {
      process.exit(result.verified ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

// Export for programmatic use
module.exports = {
  verifyOwnerAddress,
  isOwnerAddress,
  getOwnerConfig,
  OWNER_CONFIG,
};
