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
3. **Use testnets** - Use Sepolia or Holesky for Ethereum development, or appropriate testnets for other chains
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

## Pre-commit Security Tools

### Git Hooks for Secret Prevention

Consider using pre-commit hooks to prevent accidental commits of secrets:

#### Using Husky

Install husky for Git hooks:
```bash
npm install --save-dev husky
npx husky install
```

Add a pre-commit hook:
```bash
npx husky add .husky/pre-commit "npm run lint"
```

#### Using git-secrets

Install [git-secrets](https://github.com/awslabs/git-secrets) to scan for patterns:
```bash
# Install git-secrets (varies by OS)
# macOS: brew install git-secrets
# Linux: See GitHub repository for instructions

# Set up git-secrets for this repo
git secrets --install
git secrets --register-aws
```

Add custom patterns:
```bash
git secrets --add 'PRIVATE_KEY='
git secrets --add 'INFURA_PROJECT_ID='
git secrets --add 'ETHERSCAN_API_KEY='
```

### Secret Scanning Tools

Additional tools to prevent secret leaks:

1. **[TruffleHog](https://github.com/trufflesecurity/trufflehog)** - Find secrets in git history
   ```bash
   docker run --rm -v "$(pwd):/pwd" trufflesecurity/trufflehog:latest filesystem /pwd
   ```

2. **[gitleaks](https://github.com/gitleaks/gitleaks)** - Detect hardcoded secrets
   ```bash
   # Install via package manager or Docker
   gitleaks detect --source . --verbose
   ```

3. **[detect-secrets](https://github.com/Yelp/detect-secrets)** - Yelp's secret detection
   ```bash
   pip install detect-secrets
   detect-secrets scan
   ```

## Dependency Security

### Automated Dependency Scanning

#### GitHub Dependabot

This repository uses GitHub's Dependabot to automatically:
- Scan for vulnerable dependencies
- Create PRs to update vulnerable packages
- Alert maintainers of security issues

Configuration: `.github/dependabot.yml` (if present)

#### npm audit in CI/CD

The CI/CD pipeline runs `npm audit` on every push to detect:
- Known vulnerabilities in dependencies
- Outdated packages with security patches
- High/critical severity issues

#### Manual Dependency Checks

Regularly check dependencies:
```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update packages safely
npm update

# Update with breaking changes (carefully)
npm install <package>@latest
```

### Dependency Lock Files

**Always commit lock files:**
- `package-lock.json` (npm)
- `yarn.lock` (yarn)

Lock files ensure:
- Reproducible builds across environments
- Protection against malicious package updates
- Consistent dependency versions

## Incident Response

### If You Accidentally Commit a Secret

**Act immediately:**

1. **Rotate the compromised credential**
   - API keys: Regenerate in the provider's dashboard
   - Private keys: Transfer funds to a new wallet
   - Passwords: Change immediately

2. **Remove from Git history**
   ```bash
   # For recent commits (not pushed)
   git reset --soft HEAD~1
   git reset HEAD <file>
   
   # For pushed commits (requires force push - coordinate with team)
   # Use BFG Repo-Cleaner or git-filter-repo
   ```

3. **Notify the team**
   - Alert all collaborators
   - Document the incident
   - Review access logs for unauthorized use

4. **Review and improve**
   - Analyze how the secret was committed
   - Add patterns to git-secrets
   - Update documentation
   - Consider adding pre-commit hooks

### Security Incident Reporting

If you discover a security vulnerability:

1. **Do NOT create a public issue**
2. **Contact kushmanmb privately through GitHub**
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Status updates**: Every 7 days until resolved
- **Resolution**: Varies by severity (critical issues prioritized)

## Code Review Security Checklist

Before approving a PR, verify:

- [ ] No secrets or credentials in code or comments
- [ ] Environment variables used for configuration
- [ ] Input validation for all user inputs
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies are up to date (no known vulnerabilities)
- [ ] Tests cover security-critical functionality
- [ ] No SQL injection vectors (if applicable)
- [ ] No XSS vulnerabilities (if applicable)
- [ ] Proper authentication/authorization checks
- [ ] HTTPS/TLS used for network communications

## Security Testing

### Regular Security Audits

Schedule regular security reviews:
- **Monthly**: Dependency audit (`npm audit`)
- **Quarterly**: Code security review
- **Annually**: Full security audit (for production systems)

### Smart Contract Testing

For blockchain components:

1. **Unit tests**: Test individual functions
2. **Integration tests**: Test contract interactions
3. **Fuzzing**: Test with random/malformed inputs
4. **Gas optimization**: Prevent DoS via gas exhaustion
5. **External audit**: Professional audit before mainnet deployment

### Penetration Testing

For production deployments:
- Test authentication bypasses
- Test authorization checks
- Test input validation
- Test rate limiting
- Test error handling

## Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [CWE Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## Security Contact

For security concerns, contact: **kushmanmb** via GitHub

**PGP Key**: Not currently available (plain communication accepted)
