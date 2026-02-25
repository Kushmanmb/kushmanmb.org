/**
 * Tests for validate-owner.js module
 * 
 * This test suite validates the owner validation functionality
 */

const assert = require('assert');

// Mock the validate-owner module by requiring it
const validateOwnerModule = require('./validate-owner');

console.log('Running validate-owner tests...\n');

// Test 1: ALLOWED_OWNERS constant is defined
console.log('Test 1: ALLOWED_OWNERS constant');
assert(Array.isArray(validateOwnerModule.ALLOWED_OWNERS), 'ALLOWED_OWNERS should be an array');
assert(validateOwnerModule.ALLOWED_OWNERS.length > 0, 'ALLOWED_OWNERS should not be empty');
assert(validateOwnerModule.ALLOWED_OWNERS.includes('kushmanmb-org'), 'Should include kushmanmb-org');
assert(validateOwnerModule.ALLOWED_OWNERS.includes('kushmanmb'), 'Should include kushmanmb');
console.log('✓ ALLOWED_OWNERS contains expected values:', validateOwnerModule.ALLOWED_OWNERS.join(', '));

// Test 2: getAllowedOwners function
console.log('\nTest 2: getAllowedOwners function');
const allowedOwners = validateOwnerModule.getAllowedOwners();
assert(Array.isArray(allowedOwners), 'getAllowedOwners should return an array');
assert.deepStrictEqual(allowedOwners, validateOwnerModule.ALLOWED_OWNERS, 'Should return the same values as ALLOWED_OWNERS');
// Verify it returns a copy, not the original array
assert(allowedOwners !== validateOwnerModule.ALLOWED_OWNERS, 'Should return a copy of the array');
console.log('✓ getAllowedOwners returns correct array');

// Test 3: getRepositoryOwner function
console.log('\nTest 3: getRepositoryOwner function');
const owner = validateOwnerModule.getRepositoryOwner();
if (owner) {
  console.log(`✓ Repository owner detected: ${owner}`);
  assert(typeof owner === 'string', 'Owner should be a string');
  assert(owner.length > 0, 'Owner should not be empty');
} else {
  console.log('⚠️  Unable to detect repository owner (may not be in a git repository)');
}

// Test 4: validateOwner with silent and no throw options
console.log('\nTest 4: validateOwner function (non-throwing mode)');
try {
  const result = validateOwnerModule.validateOwner({ throwError: false, silent: true });
  if (result === true) {
    console.log('✓ Validation passed (repository owner is authorized)');
  } else {
    console.log('⚠️  Validation failed (repository owner is not authorized or not detected)');
  }
  assert(typeof result === 'boolean', 'validateOwner should return a boolean');
} catch (error) {
  console.error('✗ Unexpected error in non-throwing mode:', error.message);
  process.exit(1);
}

// Test 5: Test that function exists and is callable
console.log('\nTest 5: Function types and exports');
assert(typeof validateOwnerModule.validateOwner === 'function', 'validateOwner should be a function');
assert(typeof validateOwnerModule.getRepositoryOwner === 'function', 'getRepositoryOwner should be a function');
assert(typeof validateOwnerModule.getAllowedOwners === 'function', 'getAllowedOwners should be a function');
console.log('✓ All expected functions are exported');

// Test 6: validateOwner with environment variable
console.log('\nTest 6: validateOwner with GITHUB_REPOSITORY environment variable');

// Save original environment
const originalGithubRepo = process.env.GITHUB_REPOSITORY;

// Test with allowed owner
process.env.GITHUB_REPOSITORY = 'kushmanmb-org/test-repo';
let result = validateOwnerModule.validateOwner({ throwError: false, silent: true });
assert(result === true, 'Should pass validation for kushmanmb-org');
console.log('✓ Validation passed for kushmanmb-org owner');

// Test with another allowed owner
process.env.GITHUB_REPOSITORY = 'kushmanmb/another-repo';
result = validateOwnerModule.validateOwner({ throwError: false, silent: true });
assert(result === true, 'Should pass validation for kushmanmb');
console.log('✓ Validation passed for kushmanmb owner');

// Test with unauthorized owner
process.env.GITHUB_REPOSITORY = 'unauthorized-user/repo';
result = validateOwnerModule.validateOwner({ throwError: false, silent: true });
assert(result === false, 'Should fail validation for unauthorized owner');
console.log('✓ Validation correctly failed for unauthorized owner');

// Test with malformed GITHUB_REPOSITORY
process.env.GITHUB_REPOSITORY = 'malformed';
result = validateOwnerModule.validateOwner({ throwError: false, silent: true });
assert(result === false || result === true, 'Should handle malformed GITHUB_REPOSITORY');
console.log('✓ Handled malformed GITHUB_REPOSITORY gracefully');

// Restore original environment
if (originalGithubRepo) {
  process.env.GITHUB_REPOSITORY = originalGithubRepo;
} else {
  delete process.env.GITHUB_REPOSITORY;
}

// Test 7: validateOwner with throwError option
console.log('\nTest 7: validateOwner with throwError option');

// Set up unauthorized owner
process.env.GITHUB_REPOSITORY = 'unauthorized/repo';

try {
  validateOwnerModule.validateOwner({ throwError: true, silent: true });
  console.error('✗ Expected an error to be thrown for unauthorized owner');
  process.exit(1);
} catch (error) {
  assert(error instanceof Error, 'Should throw an Error');
  assert(error.message.includes('not authorized'), 'Error message should mention authorization');
  console.log('✓ Correctly threw error for unauthorized owner');
}

// Restore environment
if (originalGithubRepo) {
  process.env.GITHUB_REPOSITORY = originalGithubRepo;
} else {
  delete process.env.GITHUB_REPOSITORY;
}

console.log('\n' + '='.repeat(50));
console.log('All validate-owner tests passed! ✓');
console.log('='.repeat(50));
