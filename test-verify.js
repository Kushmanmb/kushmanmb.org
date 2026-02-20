// Test script for verify-contract.js
const { encodeConstructorArgs, NETWORKS, verifyContract } = require('./verify-contract.js');
const { ethers } = require('ethers');
const { runTestSuite } = require('./lib/test-utils');

// Test API key - this is NOT a real Etherscan API key, only for testing validation logic
const TEST_API_KEY = 'testkey123';

async function runTests(runner) {
  // Test 1: Check NETWORKS configuration
  await runner.test('Test 1: NETWORKS configuration', () => {
    if (typeof NETWORKS !== 'object') {
      throw new Error('NETWORKS should be an object');
    }
    if (!NETWORKS.sepolia) {
      throw new Error('NETWORKS should include sepolia');
    }
    if (!NETWORKS.mainnet) {
      throw new Error('NETWORKS should include mainnet');
    }
    console.log('  Supported networks:', Object.keys(NETWORKS).length);
  });

  // Test 2: encodeConstructorArgs with no arguments
  await runner.test('Test 2: encodeConstructorArgs with no arguments', () => {
    const result = encodeConstructorArgs([], []);
    if (result !== '') {
      throw new Error(`Expected empty string, got: ${result}`);
    }
  });

  // Test 3: encodeConstructorArgs with address
  await runner.test('Test 3: encodeConstructorArgs with address', () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    const result = encodeConstructorArgs(['address'], [testAddress]);
    
    // Verify it's a valid hex string without 0x prefix
    if (!/^[0-9a-f]+$/i.test(result)) {
      throw new Error('Result should be hex string without 0x prefix');
    }
    
    // Verify length (address should be 32 bytes = 64 hex chars)
    if (result.length !== 64) {
      throw new Error(`Expected 64 chars, got ${result.length}`);
    }
    
    console.log(`  Encoded: ${result.substring(0, 20)}...${result.substring(result.length - 20)}`);
  });

  // Test 4: encodeConstructorArgs with uint256
  await runner.test('Test 4: encodeConstructorArgs with uint256', () => {
    const result = encodeConstructorArgs(['uint256'], ['1000']);
    
    // Verify it's a valid hex string
    if (!/^[0-9a-f]+$/i.test(result)) {
      throw new Error('Result should be hex string without 0x prefix');
    }
    
    // Verify length (uint256 should be 32 bytes = 64 hex chars)
    if (result.length !== 64) {
      throw new Error(`Expected 64 chars, got ${result.length}`);
    }
    
    console.log(`  Encoded: ${result.substring(0, 20)}...${result.substring(result.length - 20)}`);
  });

  // Test 5: encodeConstructorArgs with multiple args
  await runner.test('Test 5: encodeConstructorArgs with multiple arguments', () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    const result = encodeConstructorArgs(
      ['address', 'uint256', 'string'],
      [testAddress, '1000', 'Hello World']
    );
    
    // Verify it's a valid hex string
    if (!/^[0-9a-f]+$/i.test(result)) {
      throw new Error('Result should be hex string without 0x prefix');
    }
    
    // Multiple args will be longer
    if (result.length < 64) {
      throw new Error('Multiple args should result in longer encoding');
    }
    
    console.log(`  Encoded length: ${result.length} chars`);
  });

  // Test 6: encodeConstructorArgs error handling
  await runner.test('Test 6: encodeConstructorArgs error handling', () => {
    try {
      encodeConstructorArgs(['address'], []); // Mismatched lengths
      throw new Error('Should have thrown error for mismatched lengths');
    } catch (error) {
      if (!error.message.includes('same length')) {
        throw error;
      }
    }
  });

  // Test 7: Verify ethers integration
  await runner.test('Test 7: Verify ethers.js integration', () => {
    if (!ethers.isAddress) {
      throw new Error('ethers.isAddress not available');
    }
    if (!ethers.AbiCoder) {
      throw new Error('ethers.AbiCoder not available');
    }
    
    // Test address validation
    const validAddress = '0x1234567890123456789012345678901234567890';
    const invalidAddress = '0xinvalid';
    
    if (!ethers.isAddress(validAddress)) {
      throw new Error('Valid address not recognized');
    }
    if (ethers.isAddress(invalidAddress)) {
      throw new Error('Invalid address incorrectly validated');
    }
  });

  // Test 8: Validate verifyContract input validation
  await runner.test('Test 8: verifyContract input validation', async () => {
    // Test invalid optimization value
    let errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        optimizationUsed: 2, // Invalid - should be 0 or 1
        apiKey: 'test',
      });
    } catch (error) {
      if (error.message.includes('optimizationUsed must be 0')) {
        errorCaught = true;
      }
    }
    
    if (!errorCaught) {
      throw new Error('Should have caught invalid optimizationUsed value');
    }
    
    // Test invalid runs value
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        runs: -1, // Invalid - should be positive
        apiKey: 'test',
      });
    } catch (error) {
      if (error.message.includes('runs must be a positive integer')) {
        errorCaught = true;
      }
    }
    
    if (!errorCaught) {
      throw new Error('Should have caught invalid runs value');
    }
  });

  // Test 9: Validate API key sanitization
  await runner.test('Test 9: API key sanitization', async () => {
    // Test with API key that has whitespace
    let errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: `  ${TEST_API_KEY}  `, // API key with whitespace
      });
    } catch (error) {
      // Should not throw for whitespace - it gets trimmed
      if (error.message.includes('Etherscan API key')) {
        errorCaught = true;
      }
    }
    
    // Test with invalid characters in API key
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: 'test-key-with-dashes!@#',
      });
    } catch (error) {
      if (error.message.includes('invalid characters')) {
        errorCaught = true;
      }
    }
    
    if (!errorCaught) {
      throw new Error('Should have caught invalid API key format');
    }
    
    // Test with empty API key after trimming
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
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
  });

  // Test 10: Validate constructor arguments format
  await runner.test('Test 10: Constructor arguments validation', async () => {
    // Test with invalid hex characters
    let errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: TEST_API_KEY,
        constructorArguments: '0xabcdefg', // Invalid hex (contains 'g')
      });
    } catch (error) {
      if (error.message.includes('valid hex string')) {
        errorCaught = true;
      }
    }
    
    if (!errorCaught) {
      throw new Error('Should have caught invalid hex in constructor args');
    }
    
    // Test with wrong length (not multiple of 64)
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: TEST_API_KEY,
        constructorArguments: 'abcdef', // Too short, not multiple of 64
      });
    } catch (error) {
      if (error.message.includes('ABI-encoded')) {
        errorCaught = true;
      }
    }
    
    if (!errorCaught) {
      throw new Error('Should have caught improperly encoded constructor args');
    }
    
    // Test with valid constructor arguments
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: TEST_API_KEY,
        constructorArguments: '0000000000000000000000001234567890123456789012345678901234567890', // 64 chars
      });
      // Should proceed without validation error (may fail on API call)
    } catch (error) {
      // Only flag as error if it's a validation error, not an API error
      if (error.message.includes('valid hex string') || error.message.includes('ABI-encoded')) {
        errorCaught = true;
      }
    }
    
    if (errorCaught) {
      throw new Error('Valid constructor args should not throw validation error');
    }
    
    // Test with empty string (should pass - no constructor args)
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: TEST_API_KEY,
        constructorArguments: '', // Empty string
      });
      // Should proceed without validation error
    } catch (error) {
      if (error.message.includes('valid hex string') || error.message.includes('ABI-encoded')) {
        errorCaught = true;
      }
    }
    
    if (errorCaught) {
      throw new Error('Empty constructor args should pass validation');
    }
    
    // Test with 128 characters (2 * 64 - two arguments)
    errorCaught = false;
    try {
      await verifyContract({
        contractAddress: '0x1234567890123456789012345678901234567890',
        sourceCode: 'contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20',
        apiKey: TEST_API_KEY,
        constructorArguments: '0000000000000000000000001234567890123456789012345678901234567890' +
                             '0000000000000000000000005678901234567890123456789012345678901234', // 128 chars
      });
      // Should proceed without validation error
    } catch (error) {
      if (error.message.includes('valid hex string') || error.message.includes('ABI-encoded')) {
        errorCaught = true;
      }
    }
    
    if (errorCaught) {
      throw new Error('128-char constructor args should pass validation');
    }
  });
}

// Run the test suite
runTestSuite('Testing verify-contract.js module...', runTests);
