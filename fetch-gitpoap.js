require('dotenv').config();
const https = require('https');
const { ethers } = require('ethers');

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
    const result = await makeRequest(apiUrl);
    
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
 * Make HTTPS GET request to GitPOAP API
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'kushmanmb-org/1.0.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 404) {
          // No GitPOAPs found for this address
          resolve([]);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.end();
  });
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
