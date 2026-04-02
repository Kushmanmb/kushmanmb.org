# ALLOWED_OWNERS Implementation

## Overview

This document describes the implementation of the `ALLOWED_OWNERS` security feature that restricts the execution of scripts and workflows to authorized repository owners only.

## Problem Statement

The requirement was to implement `ALLOWED_OWNERS=("kushmanmb.eth")` to ensure that the repository's scripts and workflows can only be executed in repositories owned by this specific owner.

## Solution

### 1. GitHub Workflows Validation

All GitHub Actions workflows now include an owner validation step as the first step before any other actions:

```bash
- name: Validate Repository Owner
  run: |
    ALLOWED_OWNERS=("kushmanmb.eth")
    REPO_OWNER="${{ github.repository_owner }}"
    
    if [[ ! " ${ALLOWED_OWNERS[@]} " =~ " ${REPO_OWNER} " ]]; then
      echo "❌ Error: This workflow can only run in repositories owned by: ${ALLOWED_OWNERS[@]}"
      echo "Current repository owner: ${REPO_OWNER}"
      exit 1
    fi
    echo "✓ Repository owner validation passed: ${REPO_OWNER}"
```

**Protected Workflows:**
- `.github/workflows/ci.yml` - CI/CD Pipeline (all 3 jobs)
- `.github/workflows/node.js.yml` - Node.js CI
- `.github/workflows/webpack.yml` - Webpack Build
- `.github/workflows/labeler.yml` - Pull Request Labeler

### 2. JavaScript Module: `validate-owner.js`

Created a reusable validation module that provides:

#### Functions:
- `validateOwner(options)` - Validates repository owner, throws error by default
- `getRepositoryOwner()` - Gets owner from environment or git config
- `getAllowedOwners()` - Returns array of allowed owners
- `ALLOWED_OWNERS` - Constant array: `['kushmanmb.eth']`

#### Features:
- Supports both `GITHUB_REPOSITORY` environment variable (GitHub Actions)
- Fallback to git remote URL parsing for local execution
- Configurable error handling (throw vs return boolean)
- Optional silent mode for programmatic use
- Clear, actionable error messages

#### Usage Example:
```javascript
const { validateOwner } = require('./validate-owner');

// Throws error if validation fails
validateOwner({ silent: false });

// Returns boolean, doesn't throw
const isValid = validateOwner({ throwError: false, silent: true });
```

### 3. Protected Scripts

Added owner validation to critical scripts:

#### `verify-contract.js`
Smart contract verification on Etherscan - validates owner before accepting any contract addresses or API keys.

#### `fetch-gitpoap.js`
GitPOAP fetching utility - validates owner before making API requests.

#### `faucet.js`
USDC faucet server - validates owner before starting the server and dispensing tokens.

Each script includes validation at the top:
```javascript
const { validateOwner } = require('./validate-owner');
validateOwner({ silent: false });
```

### 4. Testing

Created comprehensive test suite: `test-validate-owner.js`

**Test Coverage:**
- ✓ ALLOWED_OWNERS constant validation
- ✓ getAllowedOwners function
- ✓ getRepositoryOwner detection
- ✓ validateOwner with different options
- ✓ Environment variable handling
- ✓ Error throwing behavior
- ✓ Authorized owner acceptance (kushmanmb.eth)
- ✓ Unauthorized owner rejection

**Run Tests:**
```bash
npm run test:owner
```

### 5. Documentation

Updated `SECURITY_SUMMARY.md` with:
- Repository Owner Validation section
- Implementation details for workflows and scripts
- List of protected workflows and scripts
- Testing instructions
- Security rationale

## Security Benefits

1. **Fork Protection**: Prevents unauthorized users from running workflows in forked repositories
2. **Script Protection**: Ensures critical scripts (faucet, contract verification) only run in authorized repositories
3. **API Key Safety**: Prevents unauthorized use of API keys and credentials in forked repositories
4. **Resource Protection**: Prevents abuse of services (faucet, etc.) from unauthorized forks
5. **Clear Audit Trail**: All validation attempts are logged with clear success/failure messages

## Implementation Details

### Workflow Validation
- Uses `github.repository_owner` context variable
- Runs before checkout to fail fast
- Zero dependencies, pure bash implementation
- Clear error messages showing allowed vs actual owner

### JavaScript Validation
- Runs at module load time (before main logic)
- Supports both GitHub Actions and local git execution
- Graceful fallback if git is unavailable
- Exportable functions for reuse

### Testing Strategy
- Unit tests for all validation functions
- Environment variable manipulation tests
- Positive and negative test cases
- Integration with existing test suite

## Files Modified

1. `.github/workflows/ci.yml` - Added validation to 3 jobs
2. `.github/workflows/node.js.yml` - Added validation step
3. `.github/workflows/webpack.yml` - Added validation step
4. `.github/workflows/labeler.yml` - Added validation step
5. `verify-contract.js` - Added owner validation
6. `fetch-gitpoap.js` - Added owner validation
7. `faucet.js` - Added owner validation
8. `package.json` - Added `test:owner` script
9. `SECURITY_SUMMARY.md` - Added documentation

## Files Created

1. `validate-owner.js` - Owner validation module
2. `test-validate-owner.js` - Comprehensive test suite
3. `ALLOWED_OWNERS_IMPLEMENTATION.md` - This document

## Verification

All implementations have been tested and verified:

```bash
# Run all tests
npm test && npm run test:owner

# Test protected scripts
node verify-contract.js --help          # Should show validation success
node fetch-gitpoap.js --help           # Should show validation success
GITHUB_REPOSITORY="other/repo" node faucet.js  # Should fail validation

# Test workflows
# Push to repository - workflows will validate owner before running
```

## Maintenance

To add new allowed owners, update:
1. `validate-owner.js` - ALLOWED_OWNERS array
2. All workflow files - ALLOWED_OWNERS bash array
3. This documentation
4. `SECURITY_SUMMARY.md`

To protect new scripts:
1. Add `require('./validate-owner')` import
2. Call `validateOwner()` at the top of the script
3. Update documentation
