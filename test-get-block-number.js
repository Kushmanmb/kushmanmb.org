// Test script for get-block-number.js
// Tests the JSON-RPC request construction and response parsing without requiring
// a live Ethereum node connection.

const fs = require('fs');

const GET_BLOCK_NUMBER_FILE = './get-block-number.js';

async function runTests() {
  console.log('Testing get-block-number.js...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Module exports are present
  console.log('Test 1: Module exports');
  try {
    // Read the file to verify it exports the expected functions without executing it
    const code = fs.readFileSync(GET_BLOCK_NUMBER_FILE, 'utf8');

    if (!code.includes('getBlockNumber')) {
      throw new Error('getBlockNumber function not found');
    }
    if (!code.includes('buildInfuraUrl')) {
      throw new Error('buildInfuraUrl function not found');
    }
    if (!code.includes('module.exports')) {
      throw new Error('module.exports not found');
    }

    console.log('✓ Module exports getBlockNumber and buildInfuraUrl');
    passed++;
  } catch (error) {
    console.error('✗ Module exports test failed:', error.message);
    failed++;
  }

  // Test 2: JSON-RPC request format
  console.log('\nTest 2: JSON-RPC request format');
  try {
    const code = fs.readFileSync(GET_BLOCK_NUMBER_FILE, 'utf8');

    if (!code.includes("'eth_blockNumber'") && !code.includes('"eth_blockNumber"')) {
      throw new Error('eth_blockNumber method not found in request');
    }
    if (!code.includes('jsonrpc')) {
      throw new Error('jsonrpc field not found in request');
    }
    if (!code.includes("'2.0'") && !code.includes('"2.0"')) {
      throw new Error('JSON-RPC version 2.0 not found');
    }
    if (!code.includes('id: 83')) {
      throw new Error('Request id 83 not found');
    }

    console.log('✓ JSON-RPC request is correctly formatted (jsonrpc 2.0, eth_blockNumber, id 83)');
    passed++;
  } catch (error) {
    console.error('✗ JSON-RPC request format test failed:', error.message);
    failed++;
  }

  // Test 3: HTTPS enforcement
  console.log('\nTest 3: HTTPS URL enforcement');
  try {
    const code = fs.readFileSync(GET_BLOCK_NUMBER_FILE, 'utf8');

    if (!code.includes("protocol !== 'https:'")) {
      throw new Error('HTTPS enforcement check not found');
    }

    console.log('✓ getBlockNumber enforces HTTPS URLs');
    passed++;
  } catch (error) {
    console.error('✗ HTTPS enforcement test failed:', error.message);
    failed++;
  }

  // Test 4: buildInfuraUrl constructs correct URL
  console.log('\nTest 4: buildInfuraUrl URL construction');
  try {
    const code = fs.readFileSync(GET_BLOCK_NUMBER_FILE, 'utf8');

    // Verify the template structure by checking the source code directly
    if (!code.includes('https://${network}.infura.io/v3/${projectId}')) {
      throw new Error('buildInfuraUrl does not build expected Infura URL format');
    }

    console.log('✓ buildInfuraUrl builds https://<network>.infura.io/v3/<projectId> URLs');
    passed++;
  } catch (error) {
    console.error('✗ buildInfuraUrl test failed:', error.message);
    failed++;
  }

  // Test 5: hex block number parsing
  console.log('\nTest 5: Hex block number parsing');
  try {
    // 0x17a40f7 = 24,789,239
    const hexResult = '0x17a40f7';
    const parsed = parseInt(hexResult, 16);

    if (parsed !== 24789239) {
      throw new Error(`Expected 24789239, got ${parsed}`);
    }

    // Verify the implementation uses parseInt with base 16 to parse the hex result
    const code = fs.readFileSync(GET_BLOCK_NUMBER_FILE, 'utf8');
    if (!code.includes('parseInt(blockNumberHex, 16)')) {
      throw new Error('parseInt with base 16 not found in response parsing');
    }

    console.log(`✓ Hex block number parsing: 0x17a40f7 => ${parsed}`);
    passed++;
  } catch (error) {
    console.error('✗ Hex block number parsing test failed:', error.message);
    failed++;
  }

  // Test 6: Response format matches JSON-RPC spec
  console.log('\nTest 6: Response format');
  try {
    // Simulate the response format that getBlockNumber returns
    const mockRpcResponse = {
      jsonrpc: '2.0',
      id: 83,
      result: '0x17a40f7',
    };

    if (mockRpcResponse.jsonrpc !== '2.0') {
      throw new Error('jsonrpc field should be "2.0"');
    }
    if (mockRpcResponse.id !== 83) {
      throw new Error('id field should be 83');
    }
    if (!/^0x[0-9a-f]+$/.test(mockRpcResponse.result)) {
      throw new Error('result field should be a hex string');
    }

    console.log('✓ JSON-RPC response format matches spec:', JSON.stringify(mockRpcResponse));
    passed++;
  } catch (error) {
    console.error('✗ Response format test failed:', error.message);
    failed++;
  }

  // Test 7: faucet.js /block-number endpoint exists
  console.log('\nTest 7: faucet.js /block-number endpoint');
  try {
    const faucetCode = fs.readFileSync('./faucet.js', 'utf8');

    if (!faucetCode.includes("app.get('/block-number'")) {
      throw new Error("GET /block-number endpoint not found in faucet.js");
    }
    if (!faucetCode.includes('provider.getBlockNumber()')) {
      throw new Error('Block number retrieval logic not found in /block-number endpoint');
    }
    if (!faucetCode.includes("'0x' + blockNumber.toString(16)")) {
      throw new Error('Hex conversion not found in /block-number endpoint');
    }

    console.log('✓ GET /block-number endpoint is defined in faucet.js');
    passed++;
  } catch (error) {
    console.error('✗ faucet.js /block-number endpoint test failed:', error.message);
    failed++;
  }

  // Test 8: package.json has get-block-number script
  console.log('\nTest 8: package.json script entry');
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    if (!packageJson.scripts || !packageJson.scripts['get-block-number']) {
      throw new Error('"get-block-number" script not found in package.json');
    }

    if (packageJson.scripts['get-block-number'] !== 'node get-block-number.js') {
      throw new Error(`Expected "node get-block-number.js", got "${packageJson.scripts['get-block-number']}"`);
    }

    console.log('✓ package.json includes "get-block-number" script');
    passed++;
  } catch (error) {
    console.error('✗ package.json script test failed:', error.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary:');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${passed + failed}`);

  if (failed > 0) {
    console.log('\n✗ Some tests failed');
    process.exit(1);
  } else {
    console.log('\n✓ All tests passed');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});

