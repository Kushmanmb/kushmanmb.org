/**
 * Example: Fetching GitPOAPs for an Ethereum address
 * 
 * GitPOAP is a service that issues NFT badges (POAPs - Proof of Attendance Protocol)
 * to GitHub contributors. This example demonstrates how to fetch GitPOAPs for a given
 * Ethereum address using the fetch-gitpoap.js module.
 * 
 * Usage:
 *   node examples/fetch-gitpoap-example.js
 */

const { fetchGitPOAPs } = require('../fetch-gitpoap.js');

async function main() {
  // Example 1: Fetch GitPOAPs for a specific address
  console.log('Example 1: Fetching GitPOAPs for an address\n');
  console.log('='.repeat(50));
  
  // Replace this with an actual Ethereum address that has GitPOAPs
  // This is Vitalik Buterin's address as an example
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  
  try {
    const result = await fetchGitPOAPs({ address });
    
    if (result.success) {
      console.log('\n✓ Success!');
      console.log(`Found ${result.count} GitPOAP(s) for ${result.address}`);
      
      if (result.count > 0) {
        console.log('\nGitPOAP Details:');
        result.gitpoaps.forEach((poap, index) => {
          console.log(`\n${index + 1}. ${poap.gitPoapEventName || poap.name || 'Unnamed'}`);
          console.log(`   GitPOAP ID: ${poap.gitPoapId || 'N/A'}`);
          console.log(`   Token ID: ${poap.poapTokenId || 'N/A'}`);
          if (poap.year) console.log(`   Year: ${poap.year}`);
          if (poap.imageUrl) console.log(`   Image: ${poap.imageUrl}`);
        });
      }
    } else {
      console.error('✗ Failed:', result.error);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Example 2: Testing with a custom address (from environment or argument)
  if (process.argv[2]) {
    console.log('\n\nExample 2: Fetching GitPOAPs for custom address\n');
    console.log('='.repeat(50));
    
    const customAddress = process.argv[2];
    try {
      const result = await fetchGitPOAPs({ address: customAddress });
      
      if (result.success) {
        console.log(`\n✓ Found ${result.count} GitPOAP(s)`);
      } else {
        console.error('✗ Failed:', result.error);
      }
    } catch (error) {
      console.error('✗ Error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50));
  }
  
  // Example 3: Error handling for invalid address
  console.log('\n\nExample 3: Error handling with invalid address\n');
  console.log('='.repeat(50));
  
  try {
    const result = await fetchGitPOAPs({ address: 'invalid-address' });
    console.log('This should not print');
  } catch (error) {
    console.log('✓ Correctly caught error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
}

// Run the examples
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
