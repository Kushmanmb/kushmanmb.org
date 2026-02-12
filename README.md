# kywmahmb

A slot machine game with performance optimizations and Ethereum testnet integration.

> **Note**: For ownership and attribution information, see [OWNERSHIP.md](OWNERSHIP.md)

## Table of Contents

- [Documentation](#documentation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Building the Project](#building-the-project)
  - [Running the Game](#running-the-game)
  - [Running Tests](#running-tests)
- [Contract Verification](#contract-verification)
- [USDC Faucet Server](#usdc-faucet-server)
- [Performance Improvements](#performance-improvements)
- [Project Structure](#project-structure)
- [Development](#development)
- [CI/CD Workflows](#cicd-workflows)
- [Ownership](#ownership)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Documentation

- 📋 [Coding Guidelines](CODING_GUIDELINES.md) - Comprehensive coding standards and best practices
- 🏗️ [Development Infrastructure](.github/DEVELOPMENT_INFRASTRUCTURE.md) - CI/CD, templates, and tooling guide
- 📝 [Configuration Templates](.github/) - Templates for roles, communication, and guidelines
- 📁 [Files and Structure](FILES.md) - Comprehensive file and directory reference
- 🔒 [Security Policy](.github/SECURITY.md) - Security best practices and reporting

## Getting Started

### Prerequisites

- Node.js (version 18.x, 20.x, or 22.x)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kushmanmb/kywmahmb.git
```

2. Navigate to the project directory:
```bash
cd kywmahmb
```

3. Install dependencies:
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Building the Project

Build the project to create distribution files:
```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

This will copy all necessary files from `src/` to `dist/` directory.

Alternatively, you can use Webpack to bundle the project:
```bash
# Using npm
npm run webpack

# Or using yarn
yarn webpack
```

### Running the Game

After building, open `dist/index.html` in a web browser to play the game.

For development, you can also open `src/index.html` directly in a web browser.

### Running Tests

Run the test suite to verify game logic:
```bash
# Using npm
npm test

# Or using yarn
yarn test
```

## Contract Verification

This repository includes a contract verification tool that allows you to verify smart contracts on Etherscan and other block explorers.

### Prerequisites

- Etherscan API key (get one from [https://etherscan.io/myapikey](https://etherscan.io/myapikey))
- Contract source code
- Deployment details (compiler version, optimization settings, constructor arguments)

### Setup

Add your Etherscan API key to the `.env` file:
```bash
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Usage

Verify a deployed contract:
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

### Command Line Options

- `--address` - Contract address (required)
- `--source` - Path to source code file (required)
- `--name` - Contract name (required)
- `--compiler` - Solidity compiler version (required)
- `--network` - Network name (default: sepolia)
- `--optimization` - Optimization enabled: 0 or 1 (default: 1)
- `--runs` - Number of optimization runs (default: 200)
- `--constructor-args` - ABI-encoded constructor arguments (optional)
- `--api-key` - Etherscan API key (optional, uses ETHERSCAN_API_KEY env var)

### Supported Networks

- Ethereum: `mainnet`, `sepolia`, `holesky`
- Polygon: `polygon`, `amoy`
- Arbitrum: `arbitrum` - [Arbitrum Documentation](https://docs.arbitrum.io)
- Optimism: `optimism`
- BSC: `bsc`, `bscTestnet`

### Example with Constructor Arguments

If your contract has constructor arguments, you'll need to ABI-encode them. The verification tool includes a helper function:

```javascript
const { encodeConstructorArgs } = require('./verify-contract.js');

// For a constructor like: constructor(address _owner, uint256 _value)
const encoded = encodeConstructorArgs(
  ['address', 'uint256'],
  ['0x1234...', '1000000000000000000']
);

console.log(encoded); // Use this value for --constructor-args
```

### Programmatic Usage

You can also use the verification tool as a module in your Node.js scripts:

```javascript
const { verifyContract } = require('./verify-contract.js');

const result = await verifyContract({
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
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

## USDC Faucet Server

This repository also includes a USDC faucet server for dispensing USDC tokens on Ethereum testnet.

### Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your `.env` file with:
   - `INFURA_PROJECT_ID`: Your Infura project ID
   - `PRIVATE_KEY`: Private key of the wallet that will dispense USDC
   - `USDC_CONTRACT_ADDRESS`: Address of the USDC contract on your testnet (Sepolia, Goerli, etc.)
   - `ETHERSCAN_API_KEY`: Your Etherscan API key for contract verification (optional, only needed if using verification feature)

### Running the Faucet

Start the faucet server:
```bash
npm run faucet
```

The server will run at `http://localhost:3000`.

### API Endpoints

**POST /faucet**

Request USDC tokens from the faucet.

Request body:
```json
{
  "address": "0x..."
}
```

Response (success):
```json
{
  "message": "USDC dispensed successfully!"
}
```

Responses (error):
- `400`: Invalid or missing address
- `429`: Cooldown in effect (12 hour between requests)
- `500`: Faucet out of funds or transfer error

### Faucet Configuration

- **Network**: Sepolia testnet (configurable via Infura)
- **Dispense Amount**: 1 USDC per request
- **Cooldown**: 12 hour between requests per address
- **USDC Contract**: Configurable via `USDC_CONTRACT_ADDRESS` environment variable

## Performance Improvements

The code has been optimized with the following improvements:

1. **DOM Element Caching** - Frequently accessed DOM elements are cached to avoid repeated `getElementById` calls
2. **DocumentFragment Usage** - DOM operations are batched using DocumentFragment to reduce reflows and repaints
3. **Cell Reference Caching** - Cell elements are stored during creation to avoid `querySelectorAll` calls
4. **Optimized Loop Logic** - Single loop in `checkBonusTrigger` instead of multiple `some()` calls with early exit
5. **Spin Debouncing** - Prevents multiple simultaneous spins with `isSpinning` flag

## Project Structure

```
fleeing-5-0/
├── src/                 # Source files
│   ├── main.js          # Main game logic
│   ├── index.html       # HTML structure
│   ├── style.css        # Styles
│   └── siren.mp3        # Sound effect
├── dist/                # Build output (generated)
├── faucet.js            # USDC faucet server
├── test.js              # Test suite
├── build.js             # Build script
├── webpack.config.js    # Webpack configuration
└── package.json         # Project dependencies
```

## Development

To work on the project:

1. Make changes to files in the `src/` directory
2. Build the project with `npm run build`
3. Run tests with `npm test` to verify functionality
4. Open `dist/index.html` in a browser to test the game

## CI/CD Workflows

This repository uses GitHub Actions for continuous integration:

- **Node.js CI**: Runs tests and builds on Node.js versions 18.x, 20.x, and 22.x
- **Webpack Build**: Builds the project using Webpack

## Ownership

For information about project ownership, component attribution, and licensing, please see [OWNERSHIP.md](OWNERSHIP.md).

Code ownership is managed through the [CODEOWNERS](CODEOWNERS) file.

## Security

Security is a top priority for this project. Please review our comprehensive security documentation:

- 🔒 [Security Policy](.github/SECURITY.md) - Security best practices, reporting guidelines, and incident response
- 🛡️ [Security Checklist](.github/SECURITY.md#security-checklist) - Pre-commit security verification
- 🚨 [Incident Response](.github/SECURITY.md#incident-response) - What to do if you accidentally commit a secret

**Reporting Security Issues**: If you discover a security vulnerability, please report it by contacting kushmanmb through GitHub. **Do not create public issues for security vulnerabilities.**

### Quick Security Tips

- Never commit `.env` files (use `.env.example` as a template)
- Never commit private keys, mnemonics, or API keys
- Always load sensitive data from environment variables
- Use `npm audit` to check for vulnerable dependencies
- Review the comprehensive `.gitignore` file to understand what's protected

## Contributing

We welcome contributions! To ensure a smooth process:

1. **Fork the repository** and create a feature branch
2. **Read the documentation**: [CODING_GUIDELINES.md](CODING_GUIDELINES.md), [FILES.md](FILES.md)
3. **Follow security practices**: Review [SECURITY.md](.github/SECURITY.md)
4. **Write tests**: Ensure your changes are covered by tests
5. **Run tests locally**: `npm test` before submitting
6. **Submit a pull request** with a clear description of changes

**Note**: This project uses a proprietary license. By contributing, you agree that your contributions will be licensed under the same terms. Authorization from kushmanmb is required for use.

### Development Setup

Common issues and solutions:

**Issue**: `npm install` fails
- Solution: Ensure you're using Node.js 18.x, 20.x, or 22.x

**Issue**: Tests fail after changes
- Solution: Review test output, ensure bonus trigger logic is correct

**Issue**: Build produces no output
- Solution: Check that `src/` directory has all required files

**Issue**: `.env` file not working
- Solution: Copy `.env.example` to `.env` and fill in your values

## License

This project is licensed under a **Proprietary License** that requires authorization from kushmanmb for use.

**Important**: Use of this software is prohibited without prior written authorization from kushmanmb. See the [LICENSE](LICENSE) file for full details.

To request authorization to use this software, please contact kushmanmb through GitHub.
