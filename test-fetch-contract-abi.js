// Test script for fetch-contract-abi.js
const { fetchContractAbi, checkContractVerification, NETWORKS } = require('./fetch-contract-abi.js');
const { ethers } = require('ethers');

// Test API key - this is NOT a real Etherscan API key, only for testing validation logic
const TEST_API_KEY = 'testkey123';

async function runTests() {
  console.log('Testing fetch-contract-abi.js module...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Check NETWORKS configuration
  console.log('Test 1: NETWORKS configuration');
  try {
    if (typeof NETWORKS !== 'object') {
      throw new Error('NETWORKS should be an object');
    }
    if (!NETWORKS.mainnet) {
      throw new Error('NETWORKS should include mainnet');
    }
    if (!NETWORKS.sepolia) {
      throw new Error('NETWORKS should include sepolia');
    }
    if (!NETWORKS.polygon) {
      throw new Error('NETWORKS should include polygon');
    }
    console.log('✓ NETWORKS configuration is valid');
    console.log(`  Supported networks: ${Object.keys(NETWORKS).length}`);
    passed++;
  } catch (error) {
    console.error('✗ NETWORKS configuration test failed:', error.message);
    failed++;
  }

  // Test 2: fetchContractAbi validates contract address
  console.log('\nTest 2: fetchContractAbi validates contract address');
  try {
    let errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '', // Empty address
        apiKey: TEST_API_KEY,
      });
    } catch (error) {
      if (error.message.includes('Contract address is required')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught missing contract address');
    }

    // Test invalid address format
    errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '0xinvalid',
        apiKey: TEST_API_KEY,
      });
    } catch (error) {
      if (error.message.includes('Invalid contract address format')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught invalid contract address format');
    }

    console.log('✓ Contract address validation works correctly');
    passed++;
  } catch (error) {
    console.error('✗ Contract address validation test failed:', error.message);
    failed++;
  }

  // Test 3: fetchContractAbi validates API key
  console.log('\nTest 3: fetchContractAbi validates API key');
  try {
    let errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '0x1234567890123456789012345678901234567890',
        apiKey: '', // Empty API key
      });
    } catch (error) {
      if (error.message.includes('Etherscan API key is required')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught missing API key');
    }

    // Test API key with invalid characters
    errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '0x1234567890123456789012345678901234567890',
        apiKey: 'test-key-with-dashes!@#',
      });
    } catch (error) {
      if (error.message.includes('invalid characters')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught invalid API key characters');
    }

    // Test API key that is only whitespace
    errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '0x1234567890123456789012345678901234567890',
        apiKey: '   ',
      });
    } catch (error) {
      if (error.message.includes('cannot be empty')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught empty API key');
    }

    console.log('✓ API key validation works correctly');
    passed++;
  } catch (error) {
    console.error('✗ API key validation test failed:', error.message);
    failed++;
  }

  // Test 4: fetchContractAbi validates network
  console.log('\nTest 4: fetchContractAbi validates network');
  try {
    let errorCaught = false;
    try {
      await fetchContractAbi({
        contractAddress: '0x1234567890123456789012345678901234567890',
        network: 'invalidnetwork',
        apiKey: TEST_API_KEY,
      });
    } catch (error) {
      if (error.message.includes('Unsupported network')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught unsupported network');
    }

    console.log('✓ Network validation works correctly');
    passed++;
  } catch (error) {
    console.error('✗ Network validation test failed:', error.message);
    failed++;
  }

  // Test 5: checkContractVerification validates contract address
  console.log('\nTest 5: checkContractVerification validates contract address');
  try {
    let errorCaught = false;
    try {
      await checkContractVerification({
        contractAddress: '', // Empty address
        apiKey: TEST_API_KEY,
      });
    } catch (error) {
      if (error.message.includes('Contract address is required')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught missing contract address');
    }

    // Test invalid address format
    errorCaught = false;
    try {
      await checkContractVerification({
        contractAddress: 'notanaddress',
        apiKey: TEST_API_KEY,
      });
    } catch (error) {
      if (error.message.includes('Invalid contract address format')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught invalid contract address format');
    }

    console.log('✓ checkContractVerification address validation works correctly');
    passed++;
  } catch (error) {
    console.error('✗ checkContractVerification address validation test failed:', error.message);
    failed++;
  }

  // Test 6: checkContractVerification validates API key
  console.log('\nTest 6: checkContractVerification validates API key');
  try {
    let errorCaught = false;
    try {
      await checkContractVerification({
        contractAddress: '0x1234567890123456789012345678901234567890',
        apiKey: '', // Empty API key
      });
    } catch (error) {
      if (error.message.includes('Etherscan API key is required')) {
        errorCaught = true;
      }
    }

    if (!errorCaught) {
      throw new Error('Should have caught missing API key');
    }

    console.log('✓ checkContractVerification API key validation works correctly');
    passed++;
  } catch (error) {
    console.error('✗ checkContractVerification API key validation test failed:', error.message);
    failed++;
  }

  // Test 7: Verify ethers integration
  console.log('\nTest 7: Verify ethers.js integration');
  try {
    if (!ethers.isAddress) {
      throw new Error('ethers.isAddress not available');
    }

    // Test valid addresses
    const validAddresses = [
      '0x1234567890123456789012345678901234567890',
      '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    ];

    for (const addr of validAddresses) {
      if (!ethers.isAddress(addr)) {
        throw new Error(`Valid address ${addr} not recognized`);
      }
    }

    // Test invalid addresses
    const invalidAddresses = [
      '0xinvalid',
      'not an address',
      '12345',
      '',
    ];

    for (const addr of invalidAddresses) {
      if (ethers.isAddress(addr)) {
        throw new Error(`Invalid address ${addr} incorrectly validated`);
      }
    }

    console.log('✓ ethers.js integration working correctly');
    passed++;
  } catch (error) {
    console.error('✗ ethers.js integration test failed:', error.message);
    failed++;
  }

  // Test 8: Default network value
  console.log('\nTest 8: Default network is mainnet');
  try {
    // We can't actually test this without making an API call,
    // but we can verify the NETWORKS object has mainnet
    if (!NETWORKS.mainnet) {
      throw new Error('mainnet network should be available');
    }
    if (!NETWORKS.mainnet.includes('api.etherscan.io')) {
      throw new Error('mainnet should point to api.etherscan.io');
    }
    console.log('✓ Default network configuration is correct');
    passed++;
  } catch (error) {
    console.error('✗ Default network test failed:', error.message);
    failed++;
  }

  // Test 9: All network URLs are HTTPS
  console.log('\nTest 9: All network URLs use HTTPS');
  try {
    for (const [network, url] of Object.entries(NETWORKS)) {
      if (!url.startsWith('https://')) {
        throw new Error(`Network ${network} URL does not use HTTPS: ${url}`);
      }
    }
    console.log('✓ All network URLs use HTTPS');
    passed++;
  } catch (error) {
    console.error('✗ HTTPS test failed:', error.message);
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
