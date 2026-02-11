# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by contacting kushmanmb through GitHub. Please do not create public issues for security vulnerabilities.

## Security Best Practices

### Sensitive Data Protection

This repository is configured to prevent accidental commits of sensitive data:

#### Protected File Patterns

The `.gitignore` file is configured to exclude:

- **Environment Variables**: `.env`, `.env.local`, `.env.staging`, `.env.prod`
- **Private Keys**: `*.key`, `*.pem`, `*.p12`, `*.pfx`, any file containing "private-key" or "privatekey"
- **Wallet Files**: `*.keystore`, `*.wallet`, `mnemonic.txt`, `seed.txt`, recovery phrases
- **API Keys**: Files containing "api-key", "apikey", `credentials.json`, `api-keys.json`
- **Configuration**: `config.local.*`, any file containing "credentials"
- **Blockchain Data**: `accounts.json`, `deployed-contracts.json`, RPC URLs, provider configs

#### What to Keep Secure

**Never commit:**
- Private keys or mnemonics
- API keys (Etherscan, Infura, Alchemy)
- Wallet passwords or passphrases
- `.env` files with real credentials
- Production configuration files
- Database credentials

**Always use:**
- `.env.example` files as templates
- Environment variables for sensitive data
- GitHub Secrets for CI/CD credentials
- Secure key management services for production

### GitHub Actions Security

All workflows in this repository follow security best practices:

#### Permissions

Workflows use **least privilege** permissions:
```yaml
permissions:
  contents: read
  pull-requests: read
```

Only specific jobs that need write access (like security-events) request it explicitly.

#### Best Practices Implemented

1. **`persist-credentials: false`** - Prevents credential exposure in checked-out code
2. **`timeout-minutes`** - Prevents runaway jobs that could be exploited
3. **`fail-fast: false`** - Allows all matrix jobs to complete for better visibility
4. **`npm ci`** - Uses clean install for reproducible builds
5. **npm audit** - Checks for known vulnerabilities in dependencies
6. **Secret scanning** - Automated checks for patterns that might indicate secrets

### Dependency Management

#### Audit Dependencies

Before installing new packages, check for vulnerabilities:
```bash
npm audit
```

Fix vulnerabilities when possible:
```bash
npm audit fix
```

#### Keep Dependencies Updated

Regularly update dependencies to get security patches:
```bash
npm update
npm outdated
```

### Development Workflow

1. **Never commit secrets** - Use `.env.example` as a template and keep actual secrets in `.env` (gitignored)
2. **Review changes** - Always review `git diff` before committing to catch accidental secret inclusion
3. **Use environment variables** - Load sensitive data from environment variables, not hardcoded values
4. **Test with fake data** - Use fake/test API keys and addresses during development
5. **Rotate compromised credentials** - If you accidentally commit a secret, rotate it immediately

### Smart Contract Security

When working with smart contracts:

1. **Test thoroughly** - Always test on testnet before mainnet
2. **Verify contracts** - Use the verification tool to make contracts auditable
3. **Use testnets** - Use Sepolia, Goerli, or other testnets for development
4. **Protect private keys** - Never commit private keys; use hardware wallets for production
5. **Audit code** - Have contracts audited before deploying to mainnet

### CI/CD Security

The repository's CI/CD pipeline includes:

- **Automated testing** on every push and PR
- **Multi-version testing** across Node.js 18.x, 20.x, and 22.x
- **Dependency auditing** to catch vulnerable packages
- **Build verification** to ensure artifacts are created correctly
- **Secret pattern detection** to warn about potential credential leaks

## Secure Configuration Examples

### Using Environment Variables

**Bad** ❌:
```javascript
const apiKey = "sk_live_abc123xyz789"; // Never do this!
```

**Good** ✅:
```javascript
const apiKey = process.env.ETHERSCAN_API_KEY;
if (!apiKey) {
  throw new Error('ETHERSCAN_API_KEY environment variable is required');
}
```

### Handling Private Keys

**Bad** ❌:
```javascript
const privateKey = "0x1234567890abcdef..."; // Never do this!
```

**Good** ✅:
```javascript
require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('PRIVATE_KEY environment variable is required');
}
```

## Security Checklist

Before committing code, verify:

- [ ] No `.env` files are included (use `.env.example` instead)
- [ ] No private keys, mnemonics, or passwords in code
- [ ] No API keys or tokens hardcoded
- [ ] All sensitive data loaded from environment variables
- [ ] `.gitignore` is properly configured
- [ ] Tests pass locally
- [ ] No test secrets are real production credentials

## Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
