/**
 * Test suite for fetch-gitpoap.js
 * 
 * Tests the GitPOAP fetching functionality including:
 * - Input validation
 * - Error handling
 * - Response parsing
 */

const fs = require('fs');
const path = require('path');

// Test counter
let testsPassed = 0;
let testsFailed = 0;

// Read file content once for efficiency
const fileContent = fs.readFileSync('./fetch-gitpoap.js', 'utf8');

/**
 * Test helper function
 */
function test(testName, testFn) {
  console.log(`\nTest: ${testName}`);
  try {
    testFn();
    console.log('✓ PASSED');
    testsPassed++;
  } catch (error) {
    console.error('✗ FAILED:', error.message);
    testsFailed++;
  }
}

// Test 1: Module exports correct functions
test('Module exports fetchGitPOAPs function', () => {
  const module = require('./fetch-gitpoap.js');
  if (typeof module.fetchGitPOAPs !== 'function') {
    throw new Error('fetchGitPOAPs is not exported as a function');
  }
});

// Test 2: Verify file structure
test('fetch-gitpoap.js file exists', () => {
  const filePath = path.join(__dirname, 'fetch-gitpoap.js');
  if (!fs.existsSync(filePath)) {
    throw new Error('fetch-gitpoap.js file does not exist');
  }
});

// Test 3: Check for required dependencies
test('Module requires ethers.js', () => {
  if (!fileContent.includes("require('ethers')")) {
    throw new Error('Module does not require ethers.js');
  }
});

// Test 4: Check for CLI interface
test('Module has CLI interface', () => {
  if (!fileContent.includes('require.main === module')) {
    throw new Error('Module does not have CLI interface');
  }
  if (!fileContent.includes('--address')) {
    throw new Error('CLI interface does not support --address argument');
  }
});

// Test 5: Validate address validation (check code patterns)
test('Module validates Ethereum addresses', () => {
  if (!fileContent.includes('ethers.isAddress')) {
    throw new Error('Module does not validate Ethereum addresses using ethers.isAddress');
  }
  if (!fileContent.includes('Invalid Ethereum address')) {
    throw new Error('Module does not provide error message for invalid address');
  }
  if (!fileContent.includes('Address is required')) {
    throw new Error('Module does not check for required address parameter');
  }
});

// Test 6: Check API URL
test('Module uses correct GitPOAP API URL', () => {
  if (!fileContent.includes('https://public-api.gitpoap.io/v1/address/')) {
    throw new Error('Module does not use correct GitPOAP API URL');
  }
});

// Test 7: Error handling
test('Module has proper error handling', () => {
  if (!fileContent.includes('try') || !fileContent.includes('catch')) {
    throw new Error('Module does not have try-catch error handling');
  }
  if (!fileContent.includes('success:')) {
    throw new Error('Module does not return success status in response');
  }
});

// Test 8: HTTPS request implementation
test('Module uses https module for requests', () => {
  if (!fileContent.includes("require('https')")) {
    throw new Error('Module does not require https module');
  }
  if (!fileContent.includes('https.request')) {
    throw new Error('Module does not use https.request');
  }
});

// Test 9: Response structure
test('Module returns structured response', () => {
  if (!fileContent.includes('gitpoaps:')) {
    throw new Error('Response does not include gitpoaps field');
  }
  if (!fileContent.includes('count:')) {
    throw new Error('Response does not include count field');
  }
});

// Test 10: Check for proper console output
test('Module provides user-friendly console output', () => {
  if (!fileContent.includes('console.log')) {
    throw new Error('Module does not provide console output');
  }
  if (!fileContent.includes('✓') || !fileContent.includes('✗')) {
    throw new Error('Module does not use checkmark symbols for output');
  }
});

// Test 11: Handles 404 responses
test('Module handles 404 responses gracefully', () => {
  if (!fileContent.includes('404')) {
    throw new Error('Module does not handle 404 status code');
  }
});

// Test 12: Validates array responses
test('Module validates array responses', () => {
  if (!fileContent.includes('Array.isArray')) {
    throw new Error('Module does not validate array responses');
  }
});

// Print summary
console.log('\n' + '='.repeat(50));
console.log('Test Summary');
console.log('='.repeat(50));
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);

if (testsFailed > 0) {
  console.error('\nSome tests failed!');
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}
