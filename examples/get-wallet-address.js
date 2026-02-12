/**
 * Example: How to retrieve the faucet wallet address
 * 
 * This example demonstrates how to use the GET /wallet endpoint
 * to retrieve the public wallet address used by the faucet server.
 */

// Example 1: Using fetch in Node.js (requires node-fetch or Node 18+)
async function getWalletAddressWithFetch() {
  try {
    const response = await fetch('http://localhost:3000/wallet');
    const data = await response.json();
    
    console.log('Wallet Address:', data.address);
    console.log('Message:', data.message);
    
    return data.address;
  } catch (error) {
    console.error('Error fetching wallet address:', error);
  }
}

// Example 2: Using curl command (can be run from terminal)
function getCurlCommand() {
  return 'curl http://localhost:3000/wallet';
}

// Example 3: Expected response format
function getExpectedResponse() {
  return {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    message: 'This is the faucet wallet address that dispenses USDC tokens.'
  };
}

// Main execution
if (require.main === module) {
  console.log('='.repeat(60));
  console.log('Faucet Wallet Address Retrieval Example');
  console.log('='.repeat(60));
  
  console.log('\n1. Using cURL:');
  console.log(`   ${getCurlCommand()}`);
  
  console.log('\n2. Expected Response:');
  console.log('   ', JSON.stringify(getExpectedResponse(), null, 2));
  
  console.log('\n3. Using JavaScript fetch():');
  console.log('   ', getWalletAddressWithFetch.toString().split('\n').slice(1, -1).join('\n   '));
  
  console.log('\n' + '='.repeat(60));
  console.log('Notes:');
  console.log('- The wallet address is a PUBLIC address (safe to share)');
  console.log('- Private keys are NEVER exposed through this endpoint');
  console.log('- The address is also displayed when the server starts');
  console.log('- Make sure the faucet server is running on port 3000');
  console.log('='.repeat(60));
}

module.exports = {
  getWalletAddressWithFetch,
  getCurlCommand,
  getExpectedResponse
};
