/**
 * Repository owner validation utility
 * 
 * This module provides functionality to validate that scripts are running
 * in repositories owned by authorized GitHub organizations/users.
 * 
 * Owner: kushmanmb.eth
 * Verified Ethereum Address: 0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253
 * GitHub Username: Kushmanmb
 */

const ALLOWED_OWNERS = ['Kushmanmb'];

// Verified owner Ethereum address
const OWNER_ETH_ADDRESS = '0x6fb9e80dDd0f5DC99D7cB38b07e8b298A57bF253';
const OWNER_ENS_NAME = 'kushmanmb.eth';

/**
 * Get the repository owner from git config or environment
 * @returns {string|null} Repository owner or null if not found
 */
function getRepositoryOwner() {
  // Try to get from GITHUB_REPOSITORY environment variable (set in GitHub Actions)
  if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    if (parts.length === 2) {
      return parts[0];
    }
  }
  
  // Try to get from git remote URL
  try {
    const { execSync } = require('child_process');
    const remoteUrl = execSync('git config --get remote.origin.url', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    
    // Parse GitHub URLs:
    // https://github.com/owner/repo or git@github.com:owner/repo.git
    const match = remoteUrl.match(/github\.com[/:]([\w-]+)\/([\w-]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    // Git command failed, continue
  }
  
  return null;
}

/**
 * Validate that the current repository is owned by an allowed owner
 * @param {Object} options - Validation options
 * @param {boolean} options.throwError - Whether to throw an error on validation failure (default: true)
 * @param {boolean} options.silent - Suppress console output (default: false)
 * @returns {boolean} True if owner is allowed, false otherwise
 * @throws {Error} If validation fails and throwError is true
 */
function validateOwner(options = {}) {
  const { throwError = true, silent = false } = options;
  
  const owner = getRepositoryOwner();
  
  if (!owner) {
    const message = 'Unable to determine repository owner. This script must run in a GitHub repository.';
    if (!silent) {
      console.warn(`⚠️  ${message}`);
    }
    if (throwError) {
      throw new Error(message);
    }
    return false;
  }
  
  const isAllowed = ALLOWED_OWNERS.includes(owner);
  
  if (!isAllowed) {
    const message = `Repository owner "${owner}" is not authorized. Allowed owners: ${ALLOWED_OWNERS.join(', ')}`;
    if (!silent) {
      console.error(`❌ ${message}`);
    }
    if (throwError) {
      throw new Error(message);
    }
    return false;
  }
  
  if (!silent) {
    console.log(`✓ Repository owner validation passed: ${owner}`);
  }
  
  return true;
}

/**
 * Get the list of allowed owners
 * @returns {string[]} Array of allowed owner names
 */
function getAllowedOwners() {
  return [...ALLOWED_OWNERS];
}

/**
 * Get owner Ethereum information
 * @returns {Object} Owner ENS name and verified address
 */
function getOwnerEthInfo() {
  return {
    ensName: OWNER_ENS_NAME,
    address: OWNER_ETH_ADDRESS,
  };
}

module.exports = {
  validateOwner,
  getRepositoryOwner,
  getAllowedOwners,
  getOwnerEthInfo,
  ALLOWED_OWNERS,
  OWNER_ETH_ADDRESS,
  OWNER_ENS_NAME,
};
