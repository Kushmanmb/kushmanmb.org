require('dotenv').config();
const fs = require('fs');
const https = require('https');
const { ethers } = require('ethers');
const { validateOwner } = require('./validate-owner');

// Validate repository owner before proceeding
validateOwner({ silent: false });

// Network configurations for ABI fetching
const NETWORKS = {
  mainnet: 'https://api.etherscan.io/api',
  sepolia: 'https://api-sepolia.etherscan.io/api',
  holesky: 'https://api-holesky.etherscan.io/api',
  polygon: 'https://api.polygonscan.com/api',
  amoy: 'https://api-amoy.polygonscan.com/api',
  arbitrum: 'https://api.arbiscan.io/api',
  optimism: 'https://api-optimistic.etherscan.io/api',
  bsc: 'https://api.bscscan.com/api',
  bscTestnet: 'https://api-testnet.bscscan.com/api',
};

/**
 * Fetch contract ABI from Etherscan-based block explorers
 * 
 * @param {Object} options - Fetch options
 * @param {string} options.contractAddress - The deployed contract address
 * @param {string} options.network - Network name (default: 'mainnet')
 * @param {string} options.apiKey - Etherscan API key (optional, uses env var if not provided)
 * @returns {Promise<Object>} - Result containing ABI or error
 */
async function fetchContractAbi(options) {
  const {
    contractAddress,
    network = 'mainnet',
    apiKey = process.env.ETHERSCAN_API_KEY,
  } = options;

  // Validate required parameters
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }
  if (!ethers.isAddress(contractAddress)) {
    throw new Error('Invalid contract address format');
  }
  if (!apiKey) {
    throw new Error('Etherscan API key is required. Set ETHERSCAN_API_KEY environment variable.');
  }

  // Sanitize and validate API key
  const sanitizedApiKey = apiKey.trim();
  if (sanitizedApiKey.length === 0) {
    throw new Error('Etherscan API key cannot be empty');
  }
  if (!/^[a-zA-Z0-9]+$/.test(sanitizedApiKey)) {
    throw new Error('Etherscan API key contains invalid characters. API keys should only contain alphanumeric characters.');
  }

  const apiUrl = NETWORKS[network];
  if (!apiUrl) {
    throw new Error(`Unsupported network: ${network}. Supported networks: ${Object.keys(NETWORKS).join(', ')}`);
  }

  console.log(`Fetching ABI for contract ${contractAddress} on ${network}...`);

  try {
    const result = await makeRequest(apiUrl, sanitizedApiKey, contractAddress);

    if (result.status !== '1') {
      const sanitizedError = sanitizeErrorMessage(result.result || result.message);
      throw new Error(`Failed to fetch ABI: ${sanitizedError}`);
    }

    // Parse the ABI
    let abi;
    try {
      abi = JSON.parse(result.result);
    } catch (parseError) {
      throw new Error('Failed to parse ABI JSON from Etherscan response');
    }

    console.log(`✓ ABI fetched successfully!`);
    console.log(`  Contract: ${contractAddress}`);
    console.log(`  Network: ${network}`);
    console.log(`  Functions: ${abi.filter(item => item.type === 'function').length}`);
    console.log(`  Events: ${abi.filter(item => item.type === 'event').length}`);

    return {
      success: true,
      contractAddress,
      network,
      abi,
      functionCount: abi.filter(item => item.type === 'function').length,
      eventCount: abi.filter(item => item.type === 'event').length,
    };
  } catch (error) {
    console.error('✗ Failed to fetch ABI:', error.message);
    return {
      success: false,
      contractAddress,
      network,
      error: error.message,
    };
  }
}

/**
 * Check if a contract is verified on Etherscan
 * 
 * @param {Object} options - Check options
 * @param {string} options.contractAddress - The deployed contract address
 * @param {string} options.network - Network name (default: 'mainnet')
 * @param {string} options.apiKey - Etherscan API key (optional, uses env var if not provided)
 * @returns {Promise<Object>} - Result containing verification status
 */
async function checkContractVerification(options) {
  const {
    contractAddress,
    network = 'mainnet',
    apiKey = process.env.ETHERSCAN_API_KEY,
  } = options;

  // Validate required parameters
  if (!contractAddress) {
    throw new Error('Contract address is required');
  }
  if (!ethers.isAddress(contractAddress)) {
    throw new Error('Invalid contract address format');
  }
  if (!apiKey) {
    throw new Error('Etherscan API key is required. Set ETHERSCAN_API_KEY environment variable.');
  }

  // Sanitize and validate API key
  const sanitizedApiKey = apiKey.trim();
  if (sanitizedApiKey.length === 0) {
    throw new Error('Etherscan API key cannot be empty');
  }
  if (!/^[a-zA-Z0-9]+$/.test(sanitizedApiKey)) {
    throw new Error('Etherscan API key contains invalid characters. API keys should only contain alphanumeric characters.');
  }

  const apiUrl = NETWORKS[network];
  if (!apiUrl) {
    throw new Error(`Unsupported network: ${network}. Supported networks: ${Object.keys(NETWORKS).join(', ')}`);
  }

  console.log(`Checking verification status for contract ${contractAddress} on ${network}...`);

  try {
    const result = await makeSourceCodeRequest(apiUrl, sanitizedApiKey, contractAddress);

    if (result.status !== '1') {
      // Status '0' with specific message indicates not verified
      const message = result.result || result.message || '';
      if (typeof message === 'string' && message.includes('not verified')) {
        console.log(`✗ Contract is NOT verified on ${network}`);
        return {
          success: true,
          verified: false,
          contractAddress,
          network,
          message: 'Contract source code is not verified',
        };
      }
      const sanitizedError = sanitizeErrorMessage(message);
      throw new Error(`Failed to check verification: ${sanitizedError}`);
    }

    // Check if we got source code data
    const sourceInfo = Array.isArray(result.result) ? result.result[0] : result.result;
    const isVerified = sourceInfo && sourceInfo.SourceCode && sourceInfo.SourceCode.length > 0;

    if (isVerified) {
      console.log(`✓ Contract IS verified on ${network}`);
      console.log(`  Contract Name: ${sourceInfo.ContractName}`);
      console.log(`  Compiler: ${sourceInfo.CompilerVersion}`);
      console.log(`  Optimization: ${sourceInfo.OptimizationUsed === '1' ? 'Yes' : 'No'}`);
      if (sourceInfo.OptimizationUsed === '1') {
        console.log(`  Runs: ${sourceInfo.Runs}`);
      }

      return {
        success: true,
        verified: true,
        contractAddress,
        network,
        contractName: sourceInfo.ContractName,
        compilerVersion: sourceInfo.CompilerVersion,
        optimizationUsed: sourceInfo.OptimizationUsed === '1',
        runs: parseInt(sourceInfo.Runs) || 200,
        licenseType: sourceInfo.LicenseType,
        explorerUrl: getExplorerUrl(network, contractAddress),
      };
    } else {
      console.log(`✗ Contract is NOT verified on ${network}`);
      return {
        success: true,
        verified: false,
        contractAddress,
        network,
        message: 'Contract source code is not verified',
      };
    }
  } catch (error) {
    console.error('✗ Failed to check verification:', error.message);
    return {
      success: false,
      contractAddress,
      network,
      error: error.message,
    };
  }
}

/**
 * Sanitize error messages to prevent information leakage
 * 
 * @param {string} errorMessage - Raw error message from API
 * @returns {string} - Sanitized error message
 */
function sanitizeErrorMessage(errorMessage) {
  if (!errorMessage || typeof errorMessage !== 'string') {
    return 'Unknown error occurred';
  }

  const safeErrors = [
    'Contract source code not verified',
    'Invalid API Key',
    'rate limit',
    'Invalid address format',
    'Unable to locate ContractCode',
    'Contract not found',
  ];

  const lowerError = errorMessage.toLowerCase();
  for (const safeError of safeErrors) {
    if (lowerError.includes(safeError.toLowerCase())) {
      return errorMessage;
    }
  }

  return 'Operation failed. Please check your inputs and try again.';
}

/**
 * Make HTTPS GET request to Etherscan API for ABI
 */
function makeRequest(baseUrl, apiKey, contractAddress) {
  return new Promise((resolve, reject) => {
    // Use POST to avoid exposing API key in URL/logs
    const postData = new URLSearchParams({
      module: 'contract',
      action: 'getabi',
      address: contractAddress,
      apikey: apiKey,
    }).toString();

    const urlObj = new URL(baseUrl);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
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
          reject(new Error('Failed to parse API response'));
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
 * Make HTTPS POST request to Etherscan API for source code
 */
function makeSourceCodeRequest(baseUrl, apiKey, contractAddress) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address: contractAddress,
      apikey: apiKey,
    }).toString();

    const urlObj = new URL(baseUrl);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
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
          reject(new Error('Failed to parse API response'));
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
 * Get explorer URL for a contract address
 */
function getExplorerUrl(network, address) {
  const explorers = {
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    holesky: 'https://holesky.etherscan.io',
    polygon: 'https://polygonscan.com',
    amoy: 'https://amoy.polygonscan.com',
    arbitrum: 'https://arbiscan.io',
    optimism: 'https://optimistic.etherscan.io',
    bsc: 'https://bscscan.com',
    bscTestnet: 'https://testnet.bscscan.com',
  };

  const explorerBase = explorers[network] || 'https://etherscan.io';
  return `${explorerBase}/address/${address}#code`;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Contract ABI Fetcher & Verification Checker

Usage:
  node fetch-contract-abi.js [action] [options]

Actions:
  abi                          Fetch contract ABI
  verify                       Check if contract is verified

Options:
  --address <address>          Contract address (required)
  --network <network>          Network name (default: mainnet)
  --api-key <key>              Etherscan API key (optional, uses ETHERSCAN_API_KEY env var)
  --output <file>              Output file for ABI JSON (optional, abi action only)

Supported networks:
  ${Object.keys(NETWORKS).join(', ')}

Examples:
  # Fetch ABI for a verified contract
  node fetch-contract-abi.js abi --address 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe

  # Check if a contract is verified
  node fetch-contract-abi.js verify --address 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe

  # Fetch ABI from a different network
  node fetch-contract-abi.js abi --address 0x... --network polygon

  # Save ABI to file
  node fetch-contract-abi.js abi --address 0x... --output contract-abi.json

Environment Variables:
  ETHERSCAN_API_KEY    Etherscan API key (required if --api-key not provided)
    `);
    process.exit(0);
  }

  // Parse action
  const action = args[0];
  if (!['abi', 'verify'].includes(action)) {
    console.error(`Error: Invalid action '${action}'. Use 'abi' or 'verify'.`);
    process.exit(1);
  }

  // Parse options
  const options = {};
  let outputFile = null;

  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];

    if (value === undefined || value.startsWith('--')) {
      console.error(`Error: Missing value for --${key}`);
      process.exit(1);
    }

    switch (key) {
      case 'address':
        options.contractAddress = value;
        break;
      case 'network':
        options.network = value;
        break;
      case 'api-key':
        options.apiKey = value.trim();
        break;
      case 'output':
        outputFile = value;
        break;
      default:
        console.error(`Error: Unknown option --${key}`);
        process.exit(1);
    }
  }

  // Run the appropriate action
  async function run() {
    if (action === 'abi') {
      const result = await fetchContractAbi(options);
      if (result.success) {
        if (outputFile) {
          fs.writeFileSync(outputFile, JSON.stringify(result.abi, null, 2));
          console.log(`\nABI saved to: ${outputFile}`);
        } else {
          console.log('\nABI:');
          console.log(JSON.stringify(result.abi, null, 2));
        }
      } else {
        process.exit(1);
      }
    } else if (action === 'verify') {
      const result = await checkContractVerification(options);
      if (!result.success) {
        process.exit(1);
      }
      if (!result.verified) {
        console.log('\nContract is not verified. Consider verifying it using verify-contract.js');
        process.exit(0);
      }
    }
  }

  run().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

// Export for use as module
module.exports = {
  fetchContractAbi,
  checkContractVerification,
  NETWORKS,
};
