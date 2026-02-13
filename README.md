# kywmahmb

A slot machine game with performance optimizations and Ethereum testnet integration.

> **Note**: For ownership and attribution information, see [OWNERSHIP.md](OWNERSHIP.md)  
> **Creator Attribution**: See [BITCOIN_CREATOR_ATTRIBUTION.md](BITCOIN_CREATOR_ATTRIBUTION.md) for ENS-authenticated ownership claims

## Documentation

- 📋 [Coding Guidelines](CODING_GUIDELINES.md) - Comprehensive coding standards and best practices
- 🏗️ [Development Infrastructure](.github/DEVELOPMENT_INFRASTRUCTURE.md) - CI/CD, templates, and tooling guide
- 📝 [Configuration Templates](.github/) - Templates for roles, communication, and guidelines

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

### Security Features

The contract verification tool implements the following security best practices:

1. **API Key Protection**
   - API keys are transmitted via POST request body, never in URL query parameters
   - Prevents API key exposure in browser history, server logs, and HTTP referrer headers
   - API keys are automatically validated and sanitized (trimmed, alphanumeric check)

2. **Input Validation**
   - Contract addresses validated using ethers.js `isAddress()` 
   - Constructor arguments validated for proper hex format and ABI encoding
   - Optimization settings validated (must be 0 or 1)
   - Compiler version and other parameters validated

3. **Error Message Sanitization**
   - Error messages are sanitized to prevent information leakage
   - Only safe error patterns are exposed to users
   - Internal API details are not revealed in error messages

4. **Environment Variable Security**
   - API keys loaded from `.env` file (not hardcoded)
   - `.env` file is gitignored to prevent accidental commits
   - `.env.example` provided as a template

For a complete example demonstrating safe verification practices, see `examples/verify-0xe67c465.js`.

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

## GitPOAP Fetching

This repository includes a tool to fetch GitPOAPs for a given Ethereum address. GitPOAP is a service that issues NFT badges (POAPs - Proof of Attendance Protocol) to GitHub contributors.

### Usage

Fetch GitPOAPs for an address:
```bash
npm run fetch-gitpoap -- --address 0x1234567890abcdef1234567890abcdef12345678
```

Or run directly:
```bash
node fetch-gitpoap.js --address 0x1234567890abcdef1234567890abcdef12345678
```

### Command Line Options

- `--address` - Ethereum address to fetch GitPOAPs for (required)
- `--help`, `-h` - Show help message

### Programmatic Usage

You can also use the GitPOAP fetcher as a module in your Node.js scripts:

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

For a complete example, see `examples/fetch-gitpoap-example.js`.

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

**GET /wallet**

Retrieve the faucet wallet address.

Response (success):
```json
{
  "address": "0x...",
  "message": "This is the faucet wallet address that dispenses USDC tokens."
}
```

This endpoint is safe to use as it only exposes the public wallet address, not the private key. The wallet address is also displayed in the console when the server starts.

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

For information about project ownership, component attribution, ENS domain authentication, and licensing, please see:
- [OWNERSHIP.md](OWNERSHIP.md) - Basic ownership information
- [BITCOIN_CREATOR_ATTRIBUTION.md](BITCOIN_CREATOR_ATTRIBUTION.md) - Comprehensive creator attribution with ENS verification

### ENS Domains

Official ENS domains for identity verification:
- kushmanmb.eth
- kushmanmb.base.eth
- yaketh.eth

Code ownership is managed through the [CODEOWNERS](CODEOWNERS) file.

## License

This project is licensed under a **Proprietary License** that requires authorization from kushmanmb for use.

**Important**: Use of this software is prohibited without prior written authorization from kushmanmb. See the [LICENSE](LICENSE) file for full details.

To request authorization to use this software, please contact kushmanmb through GitHub.
