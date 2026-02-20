require('dotenv').config();
const { ethers } = require('ethers');
const { makeRequest } = require('./lib/http-utils');

/**
 * Fetch GitPOAPs for a given address
 * GitPOAP is a service that issues NFT badges to GitHub contributors
 * 
 * @param {Object} options - Fetch options
 * @param {string} options.address - The Ethereum address to fetch GitPOAPs for
 * @returns {Promise<Object>} - GitPOAP data
 */
async function fetchGitPOAPs(options) {
  const {
    address,
  } = options;

  // Validate required parameters
  if (!address) {
    throw new Error('Address is required');
  }
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address format');
  }

  const apiUrl = `https://public-api.gitpoap.io/v1/address/${address}/gitpoaps`;
  
  console.log(`Fetching GitPOAPs for address: ${address}...`);

  try {
    const result = await makeRequest(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'kushmanmb-org/1.0.0',
      },
      statusHandler: (res, data) => {
        // Handle 404 - no GitPOAPs found
        if (res.statusCode === 404) {
          return [];
        }
        // Handle non-200 status codes
        if (res.statusCode !== 200) {
          throw new Error(`API request failed with status ${res.statusCode}: ${data}`);
        }
        // Parse JSON response
        try {
          return JSON.parse(data);
        } catch (error) {
          throw new Error(`Failed to parse response: ${data}`);
        }
      },
    });
    
    if (!result) {
      throw new Error('Failed to fetch GitPOAPs: Empty response');
    }

    // GitPOAP API returns an array of GitPOAPs
    const gitpoaps = Array.isArray(result) ? result : [];
    
    console.log(`✓ Found ${gitpoaps.length} GitPOAP(s)`);
    
    if (gitpoaps.length > 0) {
      console.log('\nGitPOAPs:');
      gitpoaps.forEach((poap, index) => {
        console.log(`  ${index + 1}. ${poap.gitPoapEventName || poap.name || 'Unnamed POAP'}`);
        if (poap.gitPoapId) {
          console.log(`     ID: ${poap.gitPoapId}`);
        }
        if (poap.poapTokenId) {
          console.log(`     Token ID: ${poap.poapTokenId}`);
        }
        if (poap.year) {
          console.log(`     Year: ${poap.year}`);
        }
      });
    }

    return {
      success: true,
      address: address,
      count: gitpoaps.length,
      gitpoaps: gitpoaps,
    };
  } catch (error) {
    console.error('✗ Failed to fetch GitPOAPs:', error.message);
    return {
      success: false,
      address: address,
      error: error.message,
    };
  }
}

/**
 * Command-line interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command-line arguments
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--address' && i + 1 < args.length) {
      options.address = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: node fetch-gitpoap.js --address <ethereum-address>

Options:
  --address    Ethereum address to fetch GitPOAPs for (required)
  --help, -h   Show this help message

Example:
  node fetch-gitpoap.js --address 0x1234567890abcdef1234567890abcdef12345678
`);
      process.exit(0);
    }
  }

  if (!options.address) {
    console.error('Error: --address is required\n');
    console.log('Use --help for usage information');
    process.exit(1);
  }

  try {
    const result = await fetchGitPOAPs(options);
    
    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = {
  fetchGitPOAPs,
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
