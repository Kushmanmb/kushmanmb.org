# Project Files and Structure

This document provides a comprehensive overview of the files and directories in this repository.

## Table of Contents

- [Root Level Files](#root-level-files)
- [Source Directories](#source-directories)
- [Configuration Files](#configuration-files)
- [Documentation Files](#documentation-files)
- [Generated Files](#generated-files)

## Root Level Files

### Core Application Files

- **`faucet.js`** - USDC testnet faucet server implementation
  - Dispenses USDC tokens on Ethereum testnet
  - Rate limiting: 12 hours between requests per address
  - Default amount: 1 USDC per request

- **`verify-contract.js`** - Smart contract verification tool
  - Verifies deployed contracts on Etherscan and other block explorers
  - Supports multiple networks: Ethereum, Polygon, Arbitrum, Optimism, BSC
  - CLI and programmatic API

- **`script.js`** - Utility script

### Build and Configuration

- **`build.js`** - Build script
  - Copies files from `src/` to `dist/` directory
  - Simple file-based build process

- **`webpack.config.js`** - Webpack bundler configuration
  - Production mode bundling
  - Entry point: `src/main.js`
  - Output: `dist/main.bundle.js`

- **`package.json`** - Node.js project manifest
  - Dependencies: dotenv, ethers, express
  - Dev dependencies: webpack, webpack-cli
  - Scripts: build, test, webpack, faucet, verify

- **`package-lock.json`** - Locked dependency versions (npm)
- **`yarn.lock`** - Locked dependency versions (yarn)

### Test Files

- **`test.js`** - Main test suite for slot machine game logic
  - Tests bonus trigger conditions
  - Tests PRISONER, ROBBER, and COP symbol logic

- **`test-verify.js`** - Tests for contract verification tool
  - Tests network configuration
  - Tests API URL generation
  - Tests constructor argument encoding

- **`test-faucet.js`** - Tests for USDC faucet server
  - Tests cooldown logic
  - Tests rate limiting
  - Tests address validation

### Environment and Secrets

- **`.env.example`** - Template for environment variables
  - INFURA_PROJECT_ID
  - PRIVATE_KEY
  - USDC_CONTRACT_ADDRESS
  - ETHERSCAN_API_KEY
  - **Note**: Never commit actual `.env` file!

- **`Dockerfile`** - Docker containerization configuration

### Other Files

- **`ethscab`** - Ethereum-related utility file
- **`Fleeing 5-0-20250818T103925Z-1-001.zip`** - Archive file

## Source Directories

### `src/`
Game source files for the "Fleeing 5-0" slot machine game

- **`main.js`** - Main game logic with performance optimizations
  - Slot machine spin mechanics
  - Bonus trigger detection
  - DOM manipulation with caching
  - DocumentFragment usage for performance

- **`index.html`** - HTML structure for the game interface
- **`style.css`** - Styles for the game UI
- **`siren.mp3`** - Sound effect for bonus triggers

#### `src/.well-known/`
Farcaster protocol metadata

- **`README.md`** - Documentation for Farcaster integration

### `examples/`
Example implementations and usage patterns

- **`README.md`** - Overview of examples
- **`eas-signature/`** - Ethereum Attestation Service examples
  - Examples of EAS integration and signature verification

### `Fleeing 5-0/`
Legacy or alternative implementation of the slot machine game

## Configuration Files

### Git and GitHub

- **`.gitignore`** - Comprehensive exclusion patterns
  - Dependencies: `node_modules/`, lock files
  - Build outputs: `dist/`, `build/`, bundle files
  - Environment variables and secrets
  - Private keys and certificates
  - Wallet and keystore files
  - Database files
  - IDE and editor files
  - Cache and temporary files
  - **Critical**: Prevents accidental commit of sensitive data

- **`CODEOWNERS`** - Code ownership definitions
  - Defines who owns and reviews different parts of the codebase

### GitHub Configuration (`.github/`)

- **`SECURITY.md`** - Security policy and reporting guidelines
- **`DEVELOPMENT_INFRASTRUCTURE.md`** - CI/CD and tooling documentation
- **`copilot-instructions.md`** - GitHub Copilot workspace instructions
- **`TEMPLATE_ROLE.md`** - Template for role definitions
- **`TEMPLATE_GUIDELINES.md`** - Template for guideline documents
- **`TEMPLATE_COMMUNICATION.md`** - Template for communication standards
- **`FUNDING.yml`** - GitHub Sponsors configuration

#### `.github/workflows/`
GitHub Actions CI/CD workflows

- Automated testing on Node.js 18.x, 20.x, 22.x
- Webpack builds
- Security scans

#### `.github/agents/`
AI agent configurations and prompts

- **`Kushmanmb.eth.md`** - Agent configuration for Kushmanmb.eth

## Documentation Files

### Primary Documentation

- **`README.md`** - Main project documentation
  - Getting started guide
  - Installation instructions
  - Usage examples
  - Contract verification guide
  - Faucet server guide
  - Performance optimizations

- **`FILES.md`** (this file) - Comprehensive file and directory reference

- **`CODING_GUIDELINES.md`** - Coding standards and best practices
  - Code style conventions
  - Performance optimization patterns
  - Testing requirements

- **`OWNERSHIP.md`** - Ownership and attribution information
  - Project ownership structure
  - Component attribution
  - Licensing details

- **`LICENSE`** - Proprietary license
  - Requires authorization from kushmanmb for use
  - Contact through GitHub for permissions

## Generated Files

These files are created during build processes and should never be committed:

### Build Artifacts

- **`dist/`** - Build output directory (gitignored)
  - Contains compiled/copied files from `src/`
  - Generated by `npm run build`
  - Should not be committed to version control

- **`*.bundle.js`** - Webpack bundle files (gitignored)
- **`*.bundle.js.map`** - Source maps (gitignored)

### Dependencies

- **`node_modules/`** - npm/yarn installed packages (gitignored)
  - Restored with `npm install` or `yarn install`
  - Never commit this directory

### Logs and Temporary Files

- **`*.log`** - Log files (gitignored)
- **`logs/`** - Log directory (gitignored)
- **`.cache/`** - Cache directory (gitignored)
- **`tmp/`**, **`temp/`** - Temporary files (gitignored)

## File Naming Conventions

- **Uppercase** - Important documentation files (README.md, LICENSE, CODEOWNERS)
- **Lowercase** - Source code and script files (main.js, faucet.js, test.js)
- **Kebab-case** - Test files (test-verify.js, test-faucet.js)
- **Dotfiles** - Configuration (`.gitignore`, `.env.example`)

## Directory Structure Summary

```
kushmanmb.org/
├── src/                          # Game source files
│   ├── main.js
│   ├── index.html
│   ├── style.css
│   ├── siren.mp3
│   └── .well-known/              # Farcaster metadata
├── .github/                      # GitHub configuration
│   ├── workflows/                # CI/CD workflows
│   ├── agents/                   # AI agent configs
│   └── *.md                      # GitHub docs
├── examples/                     # Usage examples
│   ├── eas-signature/
│   └── README.md
├── Fleeing 5-0/                  # Legacy game implementation
├── dist/                         # Build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── faucet.js                     # USDC faucet server
├── verify-contract.js            # Contract verification tool
├── build.js                      # Build script
├── test*.js                      # Test files
├── package.json                  # Project manifest
├── README.md                     # Main documentation
├── CODING_GUIDELINES.md          # Code standards
├── OWNERSHIP.md                  # Attribution
├── LICENSE                       # Proprietary license
└── .gitignore                    # Git exclusions
```

## Quick Reference

### Essential Files for New Contributors

1. **`README.md`** - Start here for project overview
2. **`FILES.md`** - This file - understand project structure
3. **`CODING_GUIDELINES.md`** - Learn coding standards
4. **`.env.example`** - Configure environment variables
5. **`OWNERSHIP.md`** - Understand licensing and attribution
6. **`.github/SECURITY.md`** - Security policies and reporting

### Running the Project

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Test: `npm test`
4. Run faucet: `npm run faucet`
5. Open game: `dist/index.html` in browser

### Modifying the Project

- **Game logic**: Edit `src/main.js`
- **Game UI**: Edit `src/index.html` and `src/style.css`
- **Faucet**: Edit `faucet.js`
- **Verification**: Edit `verify-contract.js`
- **Tests**: Edit `test.js`, `test-verify.js`, `test-faucet.js`
- **Build**: Edit `build.js` or `webpack.config.js`

## Notes

- All sensitive files (API keys, private keys, `.env`) are gitignored
- Build artifacts should never be committed
- The `.gitignore` is comprehensive to prevent security issues
- Always use `.env.example` as a template, never commit `.env`
- See SECURITY.md for security best practices
