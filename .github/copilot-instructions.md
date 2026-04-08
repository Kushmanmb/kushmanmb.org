# Copilot Instructions for kushmanmb.org

## Project Overview

This is a multi-component toolkit repository containing:

1. **Fleeing 5-0** - A slot machine game with performance-optimized JavaScript code
2. **USDC Faucet Server** - An Express.js server for dispensing USDC tokens on Ethereum Sepolia testnet
3. **Contract Verification Tool** - Utility for verifying smart contracts on Etherscan-based explorers
4. **GitPOAP Fetcher** - Tool for fetching GitPOAP badges associated with Ethereum addresses

All components emphasize security, performance, and maintainability.

## Technology Stack

- **Language**: JavaScript (ES6+), Node.js
- **Runtime**: Node.js 18.x, 20.x, 22.x
- **Build Tools**: Webpack 5 (for game bundling)
- **Testing**: Custom Node.js test scripts
- **CI/CD**: GitHub Actions
- **Key Dependencies**:
  - `ethers` v6.x - Ethereum interaction library
  - `express` v4.x - Web server framework (for faucet)
  - `dotenv` - Environment variable management

## Build and Test Commands

### Core Commands
- `npm install` - Install all dependencies
- `npm test` - Runs all test suites (game, verify, faucet, gitpoap)
- `npm run build` - Builds the slot machine game (copies src/ to dist/)
- `npm run webpack` - Bundles the game using Webpack in production mode

### Component-Specific Commands
- `npm run test:verify` - Test contract verification tool
- `npm run test:faucet` - Test USDC faucet functionality
- `npm run test:gitpoap` - Test GitPOAP fetching
- `npm run faucet` - Start the USDC faucet server
- `npm run verify -- [options]` - Verify a smart contract on Etherscan
- `npm run fetch-gitpoap -- --address <address>` - Fetch GitPOAPs for an address

## Code Conventions and Best Practices

### General Principles
- **Security First**: Always validate inputs, sanitize outputs, protect sensitive data
- **Performance**: Optimize critical paths, cache when appropriate, avoid unnecessary operations
- **Maintainability**: Write clear, focused code with single-responsibility functions
- **Error Handling**: Always handle errors gracefully with proper logging and user-friendly messages

### JavaScript Style
- Use `const` and `let` instead of `var`
- Use template literals for string interpolation
- Prefer `async/await` over promise chains for better readability
- Keep functions focused and single-purpose
- Add comments only for complex logic or performance-related optimizations

### Security Best Practices

1. **Input Validation**
   - Validate all user inputs before processing
   - Use `ethers.isAddress()` to validate Ethereum addresses
   - Validate contract addresses, compiler versions, and all parameters
   - Sanitize error messages to prevent information leakage

2. **API Key Protection**
   - Store API keys in `.env` file (never commit to git)
   - Transmit API keys via POST body, never in URL query parameters
   - Validate and sanitize API keys (trim whitespace, check format)
   - Use `.env.example` as template without actual secrets

3. **Environment Variables**
   - Always use `dotenv` to load configuration
   - Validate required environment variables at startup
   - Exit gracefully if critical config is missing
   - Document all required variables in `.env.example`

4. **Error Message Safety**
   - Don't expose internal details (database connections, file paths, API keys)
   - Log detailed errors internally, show generic messages to users
   - Sanitize errors from external APIs before displaying

### Performance Optimizations (for Browser Code)

These patterns are critical for the Fleeing 5-0 game and any browser-based components:

1. **DOM Element Caching**: Cache frequently accessed DOM elements in variables to avoid repeated `getElementById` calls

2. **DocumentFragment Usage**: Batch DOM operations using DocumentFragment to reduce reflows and repaints when adding multiple elements

3. **Cell Reference Caching**: Store cell elements during creation in arrays to avoid `querySelectorAll` calls later

4. **Optimized Loop Logic**: Use single loops with early exit instead of multiple `some()` or `every()` calls when checking conditions

5. **Spin Debouncing**: Use boolean flags (like `isSpinning`) to prevent multiple simultaneous operations

## Project Structure

```
kushmanmb.org/
├── src/                      # Fleeing 5-0 game source files
│   ├── main.js               # Game logic with performance optimizations
│   ├── index.html            # Game HTML structure
│   ├── style.css             # Game styles
│   └── siren.mp3             # Game sound effect
├── dist/                     # Game build output (gitignored)
├── examples/                 # Example usage scripts
│   ├── verify-example.js     # Contract verification example
│   ├── verify-0xe67c465.js   # Real-world verification example
│   ├── fetch-gitpoap-example.js  # GitPOAP fetching example
│   └── get-wallet-address.js # Faucet wallet address example
├── .github/                  # GitHub configuration
│   ├── copilot-instructions.md  # This file
│   ├── DEVELOPMENT_INFRASTRUCTURE.md  # CI/CD documentation
│   └── workflows/            # GitHub Actions workflows
├── faucet.js                 # USDC faucet server
├── verify-contract.js        # Contract verification tool
├── fetch-gitpoap.js          # GitPOAP fetching tool
├── test.js                   # Game test suite
├── test-verify.js            # Verification tool tests
├── test-faucet.js            # Faucet tests
├── test-fetch-gitpoap.js     # GitPOAP tests
├── build.js                  # Game build script
├── webpack.config.js         # Webpack configuration
├── .env.example              # Environment variables template
├── CODING_GUIDELINES.md      # Comprehensive coding standards
├── OWNERSHIP.md              # Project ownership info
└── package.json              # Project dependencies and scripts
```

## Component: Fleeing 5-0 Slot Machine Game

### Overview
A browser-based slot machine game with a 6-row by 5-column grid. The game triggers a bonus when specific conditions are met in any row: PRISONER on the leftmost column (column 0), ROBBER on the rightmost column (column 4), and COP in any middle column (columns 1, 2, or 3).

### Key Files
- **src/main.js**: Core game logic including `spin()`, `checkBonusTrigger()`, and `highlightBonusSymbols()` functions
- **src/index.html**: Game HTML structure
- **src/style.css**: Game styles and animations
- **test.js**: Unit tests for bonus trigger logic

### Game Logic
The bonus trigger requires ALL three conditions in at least one row:
- PRISONER symbol on the leftmost column (column 0)
- ROBBER symbol on the rightmost column (column 4)
- COP symbol on any of the middle columns (columns 1, 2, or 3)

### Testing
When modifying game logic, ensure all test cases in `test.js` pass:
- Positive case: All three conditions met
- Negative cases: Missing PRISONER, ROBBER, or COP
- Edge cases: Conditions met in different rows

Run `npm test` to verify changes don't break existing functionality.

### Common Development Tasks

#### Adding a New Symbol
1. Add the symbol name to the `symbols` array in `src/main.js`
2. Determine if the symbol affects game mechanics:
   - **Decorative symbols** (like BAR, 7, CHERRY, BELL): No logic changes needed
   - **Bonus-triggering symbols** (like PRISONER, ROBBER, COP): Update `checkBonusTrigger()` logic
3. Add corresponding tests in `test.js` if the symbol affects game mechanics
4. Run `npm test` to verify the changes

#### Modifying Game Grid Size
1. Update the `rows` and `cols` constants in `src/main.js`
2. Adjust CSS grid layout in `src/style.css` if needed
3. Update bonus trigger logic in `checkBonusTrigger()` if column count changes:
   - Update `row[0]` check if leftmost column index changes
   - Update `row[4]` check to match new rightmost column index
   - Update `row[1]`, `row[2]`, `row[3]` checks if middle column indices change
4. Update all test cases in `test.js` to reflect new grid dimensions and column positions

---

## Component: USDC Faucet Server

### Overview
An Express.js server that dispenses USDC tokens on Ethereum testnet (Sepolia). Implements cooldown periods and input validation to prevent abuse.

### Key Files
- **faucet.js**: Main server implementation
- **test-faucet.js**: Faucet functionality tests

### Configuration
Required environment variables in `.env`:
- `INFURA_PROJECT_ID`: Infura project ID for Ethereum access
- `PRIVATE_KEY`: Private key of wallet that dispenses USDC (must have USDC balance)
- `USDC_CONTRACT_ADDRESS`: Address of USDC contract on Sepolia testnet

### Features
- **Dispense Amount**: 10 USDC per request (set in code via `DISPENSE_AMOUNT` constant)
- **Cooldown**: 12 hours between requests per address (set in code via `COOLDOWN` constant)
- **Endpoints**:
  - `GET /wallet` - Returns the faucet wallet public address
  - `POST /faucet` - Dispenses USDC to a valid address

Note: The dispense amount and cooldown period are configured as constants in `faucet.js` rather than environment variables. To change them, modify the `DISPENSE_AMOUNT` and `COOLDOWN` constants in the code.

### Security Features
- Address validation using `ethers.isAddress()`
- Cooldown enforcement to prevent spam
- Balance checking before dispensing
- In-memory request tracking (consider Redis for production)
- Error messages don't expose sensitive internal details

### Testing
Run `npm run test:faucet` to test faucet functionality. Tests verify:
- Address validation logic
- Cooldown enforcement
- Balance checking
- Error handling

### Common Development Tasks

#### Changing Dispense Amount
1. Update `DISPENSE_AMOUNT` constant in `faucet.js`
2. Note: Amount uses 6 decimals for USDC (e.g., `ethers.parseUnits('10', 6)` for 10 USDC)
3. Update tests if necessary to reflect new amount

#### Adding New Networks
1. The faucet currently uses Sepolia testnet via `new ethers.InfuraProvider('sepolia', ...)`
2. To support other networks, modify the provider initialization
3. Update `USDC_CONTRACT_ADDRESS` to match the USDC contract on the new network
4. Document network-specific requirements

#### Implementing Persistent Cooldown
Current implementation uses in-memory storage (`lastRequestTimes` object) which:
- Resets on server restart
- Doesn't scale across multiple server instances

For production:
1. Replace in-memory storage with Redis or database
2. Store request timestamps with addresses as keys
3. Implement cleanup of old entries to prevent unlimited growth
4. Update tests to mock the persistent storage

---

## Component: Contract Verification Tool

### Overview
A command-line tool and programmatic API for verifying smart contracts on Etherscan-based block explorers. Supports multiple networks including Ethereum, Polygon, Arbitrum, Optimism, and BSC.

### Key Files
- **verify-contract.js**: Main verification implementation
- **test-verify.js**: Verification tool tests
- **examples/verify-example.js**: Basic usage example
- **examples/verify-0xe67c465.js**: Real-world verification example

### Configuration
Required environment variable in `.env`:
- `ETHERSCAN_API_KEY`: Your Etherscan API key (get from https://etherscan.io/myapikey)

### Supported Networks
- Ethereum: `mainnet`, `sepolia`, `holesky`
- Polygon: `polygon`, `amoy`
- Arbitrum: `arbitrum`
- Optimism: `optimism`
- BSC: `bsc`, `bscTestnet`

### Command Line Usage
```bash
npm run verify -- \
  --address 0x1234567890abcdef1234567890abcdef12345678 \
  --source ./contracts/MyContract.sol \
  --name MyContract \
  --compiler v0.8.20+commit.a1b79de6 \
  --network sepolia \
  --optimization 1 \
  --runs 200
```

### Parameters
- `--address`: Contract address (required)
- `--source`: Path to source code file (required)
- `--name`: Contract name (required)
- `--compiler`: Solidity compiler version (required)
- `--network`: Network name (default: `sepolia`)
- `--optimization`: Optimization enabled: 0 or 1 (default: 1)
- `--runs`: Number of optimization runs (default: 200)
- `--constructor-args`: ABI-encoded constructor arguments (optional)
- `--api-key`: Etherscan API key (optional, uses env var if not provided)

### Programmatic Usage
```javascript
const { verifyContract } = require('./verify-contract.js');

const result = await verifyContract({
  contractAddress: '0x1234...',
  sourceCode: fs.readFileSync('./contracts/MyContract.sol', 'utf8'),
  contractName: 'MyContract',
  compilerVersion: 'v0.8.20+commit.a1b79de6',
  optimizationUsed: 1,
  runs: 200,
  network: 'sepolia',
  apiKey: process.env.ETHERSCAN_API_KEY,
});

if (result.success) {
  console.log('Verified!', result.explorerUrl);
} else {
  console.error('Failed:', result.error);
}
```

### Security Features
1. **API Key Protection**: Keys transmitted via POST body, never in URL
2. **Input Validation**: Validates addresses, compiler versions, optimization settings
3. **Constructor Arguments**: Validates hex format and ABI encoding
4. **Error Sanitization**: Prevents API details from leaking in error messages

### Testing
Run `npm run test:verify` to test verification functionality. Tests verify:
- Input validation (addresses, compiler versions, etc.)
- API key handling and sanitization
- Error message sanitization
- Constructor argument encoding

### Common Development Tasks

#### Adding a New Network
1. Add network entry to `NETWORKS` object in `verify-contract.js`:
   ```javascript
   newnetwork: 'https://api.newnetwork.io/api'
   ```
2. Document the network in README.md and this file
3. Add test case for the new network if needed

#### Supporting New Constructor Argument Types
1. The tool includes `encodeConstructorArgs()` helper function
2. Supports standard Solidity types: address, uint256, string, bool, bytes, arrays
3. To add new types, extend the encoding logic in `encodeConstructorArgs()`
4. Add corresponding test cases

---

## Component: GitPOAP Fetcher

### Overview
A tool for fetching GitPOAP badges associated with Ethereum addresses. GitPOAP issues NFT badges (POAPs) to GitHub contributors.

### Key Files
- **fetch-gitpoap.js**: Main fetching implementation
- **test-fetch-gitpoap.js**: GitPOAP fetcher tests
- **examples/fetch-gitpoap-example.js**: Usage example

### Command Line Usage
```bash
npm run fetch-gitpoap -- --address 0x1234567890abcdef1234567890abcdef12345678
```

Or run directly:
```bash
node fetch-gitpoap.js --address 0x1234567890abcdef1234567890abcdef12345678
```

### Programmatic Usage
```javascript
const { fetchGitPOAPs } = require('./fetch-gitpoap.js');

const result = await fetchGitPOAPs({
  address: '0x1234567890abcdef1234567890abcdef12345678',
});

if (result.success) {
  console.log(`Found ${result.count} GitPOAP(s)`);
  result.gitpoaps.forEach(poap => {
    console.log(`- ${poap.gitPoapEventName}`);
  });
} else {
  console.error('Failed:', result.error);
}
```

### Features
- Validates Ethereum addresses using `ethers.isAddress()`
- Fetches from GitPOAP public API
- Returns array of GitPOAPs with metadata (name, ID, token ID, image URL)
- Handles API errors gracefully

### Testing
Run `npm run test:gitpoap` to test GitPOAP fetching. Tests verify:
- Address validation
- API response parsing
- Error handling
- Empty result handling

---

## Dependencies

This project emphasizes minimal dependencies:

### Production Dependencies
- **ethers** (v6.x): Ethereum library for address validation, wallet management, and contract interaction
- **express** (v4.x): Web framework for the faucet server
- **dotenv** (v16.x): Environment variable management

### Development Dependencies
- **webpack** and **webpack-cli**: Used for bundling the game (development only)

### Dependency Guidelines
- Prefer vanilla JavaScript solutions over external libraries when possible
- Keep the bundle size small to maintain performance (especially for browser code)
- Regularly audit dependencies: `npm audit`
- Document why each dependency is necessary
- Update dependencies regularly while testing for compatibility
- Remove unused dependencies promptly

## Cross-Component Development Workflows

### Setting Up Development Environment
1. Clone the repository
2. Run `npm install` to install all dependencies
3. Copy `.env.example` to `.env` and configure required variables:
   - `INFURA_PROJECT_ID` (for faucet)
   - `PRIVATE_KEY` (for faucet)
   - `USDC_CONTRACT_ADDRESS` (for faucet)
   - `ETHERSCAN_API_KEY` (for verification tool)
4. Run `npm test` to verify everything works

### Making Changes
1. **Identify the component**: Determine which component your change affects
2. **Check existing patterns**: Review similar code in the component for style consistency
3. **Write tests first** (if adding new functionality): Add tests to appropriate test file
4. **Make minimal changes**: Modify only what's necessary to achieve the goal
5. **Run component tests**: Use `npm run test:verify`, `npm run test:faucet`, etc.
6. **Test manually**: For faucet/tools, run them locally to verify behavior
7. **Run all tests**: Execute `npm test` to ensure no regressions
8. **Update documentation**: If behavior changed, update README.md and this file

### Testing Strategy
- **Game (`test.js`)**: Tests game logic, bonus triggers, grid operations
- **Verification Tool (`test-verify.js`)**: Tests input validation, API key handling, error sanitization
- **Faucet (`test-faucet.js`)**: Tests address validation, cooldown logic, balance checking
- **GitPOAP (`test-fetch-gitpoap.js`)**: Tests address validation, API response handling

Run individual test suites during development, then run full suite (`npm test`) before committing.

### Common Cross-Component Tasks

#### Adding Environment Variables
1. Add variable to `.env.example` with a placeholder value and comment explaining usage
2. Document the variable in README.md under relevant component section
3. Add validation in the component code to check if variable exists at startup
4. Update this file's documentation if it affects development workflow

#### Improving Error Handling
All components should follow these patterns:
- Validate inputs at the entry point
- Use try-catch blocks for external operations (API calls, file I/O, blockchain interactions)
- Log detailed errors internally with `console.error()`
- Return/display sanitized error messages to users
- Never expose API keys, file paths, or internal system details in user-facing errors

Example:
```javascript
try {
  const result = await externalApiCall();
  return result;
} catch (error) {
  console.error('Detailed error for debugging:', error);
  throw new Error('User-friendly generic message');
}
```

#### Adding Security Features
When adding security-sensitive code:
1. Review SECURITY.md and CODING_GUIDELINES.md
2. Follow existing security patterns in similar components
3. Validate ALL user inputs
4. Sanitize ALL outputs (especially error messages)
5. Use environment variables for secrets (never hardcode)
6. Add security-focused tests to verify proper validation/sanitization
7. Document security considerations in code comments

### Performance Considerations

#### For Browser Code (Game)
- Cache DOM elements
- Use DocumentFragment for batch operations
- Minimize reflows and repaints
- Debounce user interactions
- Profile before and after optimizations

#### For Server Code (Faucet)
- Use connection pooling for external services
- Implement caching where appropriate (e.g., balance checks)
- Consider rate limiting for abuse prevention
- Monitor memory usage for in-memory stores
- Use async/await for non-blocking operations

#### For CLI Tools (Verify, GitPOAP)
- Validate inputs early to fail fast
- Cache network responses when safe (e.g., compiler versions list)
- Provide progress feedback for long operations
- Handle rate limits from external APIs gracefully



## Debugging Tips

### Game Issues
- **Game Logic**: Test with `node test.js` first - provides isolated unit tests
- **DOM Issues**: Open `dist/index.html` (or `src/index.html` for development) in browser, use DevTools console
- **Performance Issues**: Use Chrome DevTools Performance profiler to identify bottlenecks
- **Build Issues**: Verify all files exist in `src/` directory before running `npm run build`
- **Animation Problems**: Check CSS transitions and JavaScript timing in `src/style.css` and `src/main.js`

### Faucet Server Issues
- **Server Won't Start**: Check that all environment variables in `.env` are set correctly
- **Connection Issues**: Verify `INFURA_PROJECT_ID` is valid and network is accessible
- **Dispense Failures**: Check faucet wallet balance with `GET /wallet` endpoint, ensure it has sufficient USDC
- **Cooldown Not Working**: Remember in-memory store resets on restart; check `lastRequestTimes` object
- **Transaction Errors**: Verify `USDC_CONTRACT_ADDRESS` matches the network you're using

### Verification Tool Issues
- **API Key Errors**: Ensure `ETHERSCAN_API_KEY` is set and valid for the network
- **Verification Fails**: Check compiler version matches exactly (including commit hash)
- **Constructor Args Issues**: Use `encodeConstructorArgs()` helper, ensure types match contract
- **Network Errors**: Verify network name is in `NETWORKS` object and API endpoint is correct
- **Rate Limiting**: Etherscan has rate limits; wait between requests or upgrade API tier

### GitPOAP Fetcher Issues
- **Address Not Found**: Verify address format is correct (checksummed addresses are fine)
- **API Errors**: Check internet connectivity and GitPOAP API status
- **Empty Results**: Not an error - address may simply have no GitPOAPs

### General Debugging
- **Module Not Found**: Run `npm install` to ensure dependencies are installed
- **Test Failures**: Run individual test file (e.g., `node test-verify.js`) to see detailed errors
- **Git Issues**: Check branch with `git status`, review changes with `git diff`
- **Environment Issues**: Verify Node.js version is 18.x, 20.x, or 22.x with `node --version`

## File Organization

### Directory Structure
- **src/**: Game source files (main.js, index.html, style.css, siren.mp3)
- **dist/**: Game build output (gitignored, generated by `npm run build`)
- **examples/**: Example usage scripts for verification and GitPOAP tools
- **.github/**: GitHub-specific files (workflows, templates, this file)
- **Root directory**: Core tools (faucet, verify, fetch-gitpoap) and their tests

### File Naming Conventions
- **Main implementations**: `faucet.js`, `verify-contract.js`, `fetch-gitpoap.js`
- **Test files**: `test.js`, `test-verify.js`, `test-faucet.js`, `test-fetch-gitpoap.js`
- **Example files**: Located in `examples/` with descriptive names
- **Build scripts**: `build.js`, `webpack.config.js`
- **Configuration**: `.env` (gitignored), `.env.example` (committed)

### What Goes Where
- **New game features**: Add to `src/main.js`, styles to `src/style.css`
- **New game tests**: Add to `test.js`
- **New CLI tool**: Create `tool-name.js` in root, tests in `test-tool-name.js`
- **New server endpoint**: Add to `faucet.js` (or create new server file if separate concern)
- **New examples**: Add to `examples/` directory with descriptive name
- **Documentation**: Update README.md for user docs, this file for developer docs
- **CI/CD**: Add workflows to `.github/workflows/`

### Git Ignore Rules
The `.gitignore` includes:
- `dist/` - Build output
- `.env` - Environment secrets
- `node_modules/` - Dependencies
- `*.log` - Log files
- Temporary files and OS-specific files

Never commit:
- API keys or secrets
- Environment-specific configuration (except `.env.example`)
- Build artifacts or generated files
- Dependencies (tracked via `package.json` and `package-lock.json`)
- Temporary files created during development

## Additional Resources

- **CODING_GUIDELINES.md**: Comprehensive coding standards and best practices
- **README.md**: User-facing documentation for all components
- **SECURITY.md**: Security policies and vulnerability reporting
- **.github/DEVELOPMENT_INFRASTRUCTURE.md**: CI/CD pipeline and tooling documentation
- **OWNERSHIP.md**: Project ownership and licensing information

## Quick Reference

### Common Commands
```bash
# Installation
npm install

# Testing
npm test                    # All tests
npm run test:verify         # Verification tool tests
npm run test:faucet         # Faucet tests
npm run test:gitpoap        # GitPOAP tests

# Building
npm run build              # Build game (copy files)
npm run webpack            # Webpack bundle

# Running Tools
npm run faucet             # Start faucet server
npm run verify -- [opts]   # Verify contract
npm run fetch-gitpoap -- --address <addr>  # Fetch GitPOAPs

# Development
node test.js               # Run game tests directly
node <component>.js        # Run any component directly
```

### Key Principles
1. **Security**: Validate inputs, sanitize outputs, protect secrets
2. **Minimal Changes**: Only change what's necessary
3. **Test Everything**: Run tests before and after changes
4. **Document Changes**: Update docs when behavior changes
5. **Follow Patterns**: Use existing code as a guide for style and structure
