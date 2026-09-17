require('dotenv').config();
const https = require('https');
const { validateOwner } = require('./validate-owner');

// Validate repository owner before proceeding
validateOwner({ silent: false });

/**
 * Get the current Ethereum block number via JSON-RPC
 *
 * @param {Object} options - Options
 * @param {string} options.rpcUrl - The Ethereum JSON-RPC endpoint URL
 * @returns {Promise<Object>} - JSON-RPC response with hex block number in result
 */
async function getBlockNumber(options) {
  const { rpcUrl } = options;

  if (!rpcUrl) {
    throw new Error('rpcUrl is required');
  }

  // Validate that rpcUrl is a valid HTTPS URL
  let parsedUrl;
  try {
    parsedUrl = new URL(rpcUrl);
  } catch {
    throw new Error('rpcUrl must be a valid URL');
  }
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('rpcUrl must use HTTPS');
  }

  const requestBody = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 83,
  });

  console.log(`Fetching current block number from ${parsedUrl.hostname}...`);

  const response = await makeRequest(parsedUrl, requestBody);

  if (response.error) {
    throw new Error(`JSON-RPC error ${response.error.code}: ${response.error.message}`);
  }

  const blockNumberHex = response.result;
  const blockNumber = parseInt(blockNumberHex, 16);

  console.log(`✓ Current block number: ${blockNumber} (${blockNumberHex})`);

  return response;
}

/**
 * Make an HTTPS POST JSON-RPC request
 */
function makeRequest(parsedUrl, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse JSON-RPC response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.write(body);
    req.end();
  });
}

/**
 * Build the Infura HTTPS RPC URL for the given network
 */
function buildInfuraUrl(network, projectId) {
  return `https://${network}.infura.io/v3/${projectId}`;
}

/**
 * Command-line interface
 */
async function main() {
  const args = process.argv.slice(2);

  let rpcUrl = null;
  let network = 'sepolia';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if ((arg === '--rpc-url' || arg === '--url') && i + 1 < args.length) {
      rpcUrl = args[i + 1];
      i++;
    } else if (arg === '--network' && i + 1 < args.length) {
      network = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: node get-block-number.js [options]

Options:
  --rpc-url <url>    Ethereum JSON-RPC endpoint URL (required, or set via INFURA_PROJECT_ID + --network)
  --network <name>   Network name for Infura (default: sepolia)
  --help, -h         Show this help message

Environment Variables:
  INFURA_PROJECT_ID  Infura project ID (used to build RPC URL if --rpc-url is not provided)

Example:
  node get-block-number.js --rpc-url https://sepolia.infura.io/v3/YOUR_PROJECT_ID
  node get-block-number.js --network sepolia
`);
      process.exit(0);
    }
  }

  // Fall back to Infura URL built from environment variable
  if (!rpcUrl) {
    if (!process.env.INFURA_PROJECT_ID) {
      console.error('Error: --rpc-url is required, or set INFURA_PROJECT_ID environment variable\n');
      console.log('Use --help for usage information');
      process.exit(1);
    }
    rpcUrl = buildInfuraUrl(network, process.env.INFURA_PROJECT_ID);
  }

  try {
    const result = await getBlockNumber({ rpcUrl });
    console.log('\nJSON-RPC Response:');
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = {
  getBlockNumber,
  buildInfuraUrl,
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
