# Contributing to kushmanmb.org

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Security Guidelines](#security-guidelines)
- [Pull Request Process](#pull-request-process)
- [License Agreement](#license-agreement)

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inspiring community for all. Please:

- **Be respectful** of differing viewpoints and experiences
- **Be collaborative** and work together towards common goals
- **Be constructive** with criticism and feedback
- **Be inclusive** and welcoming to newcomers
- **Focus on what is best** for the project and community

### Unacceptable Behavior

- Harassment, intimidation, or discrimination of any kind
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x, 20.x, or 22.x
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **GitHub account**: For submitting contributions

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kushmanmb.org.git
   cd kushmanmb.org
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/kushmanmb-org/kushmanmb.org.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your test credentials (never use production credentials!)
   ```

6. **Run tests** to verify setup:
   ```bash
   npm test
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix issues in existing functionality
- ✨ **New features**: Add new capabilities (discuss first in an issue)
- 📝 **Documentation**: Improve or add documentation
- 🎨 **UI/UX improvements**: Enhance the user interface
- ⚡ **Performance**: Optimize code performance
- 🧪 **Tests**: Add or improve test coverage
- 🔒 **Security**: Fix security vulnerabilities (report privately first)

### Before You Start

1. **Check existing issues** to see if someone is already working on it
2. **Create or comment on an issue** to discuss your proposed changes
3. **Wait for feedback** from maintainers before starting large changes
4. **Security issues**: Report privately to kushmanmb via GitHub (do not create public issues)

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your changes:

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/issue-description
```

### Branch Naming Conventions

- **Features**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-bug`
- **Documentation**: `docs/what-you-updated`
- **Performance**: `perf/what-you-optimized`
- **Tests**: `test/what-you-tested`

### Making Changes

1. **Make your changes** in small, logical commits
2. **Test frequently** as you develop
3. **Follow coding standards** (see below)
4. **Write or update tests** for your changes
5. **Update documentation** if needed

### Committing Changes

Write clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Fix bonus trigger detection for edge case with multiple COP symbols"
git commit -m "Add tests for faucet rate limiting"
git commit -m "Update README with security best practices"

# Bad commit messages (avoid these)
git commit -m "Fixed stuff"
git commit -m "WIP"
git commit -m "Updated files"
```

**Commit message format**:
```
<type>: <short description>

<optional detailed description>

<optional footer with issue references>
```

**Types**: fix, feat, docs, style, refactor, test, chore

## Coding Standards

This project follows specific coding standards documented in [CODING_GUIDELINES.md](CODING_GUIDELINES.md).

### Key Standards

1. **Use modern JavaScript (ES6+)**
   - Use `const` and `let` instead of `var`
   - Use template literals for string interpolation
   - Use arrow functions where appropriate

2. **Performance optimizations**
   - Cache DOM elements (avoid repeated `getElementById`)
   - Use DocumentFragment for batch DOM operations
   - Store references to frequently accessed elements
   - Use early exit in loops when possible

3. **Code organization**
   - Keep functions focused and single-purpose
   - Group related functionality together
   - Use meaningful variable and function names
   - Add comments only for complex logic

4. **File organization**
   - Source files in `src/`
   - Tests in root or test directory
   - Build scripts in root
   - Documentation at appropriate levels

### Code Quality Tools

Run these before committing:

```bash
# Run tests
npm test

# Check for security vulnerabilities
npm audit

# Build to verify no errors
npm run build
```

## Testing Requirements

All contributions must include appropriate tests.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node test.js
node test-verify.js
node test-faucet.js
```

### Writing Tests

- **Test behavior, not implementation**: Test what the code does, not how it does it
- **Test edge cases**: Empty inputs, null values, boundary conditions
- **Use descriptive test names**: Clearly state what is being tested
- **Keep tests independent**: Tests should not depend on each other
- **Mock external dependencies**: Don't rely on external APIs or services

### Test Structure

```javascript
// Good test structure
function testBonusTrigger() {
  // Arrange - Set up test data
  const row = ['PRISONER', 'BAR', 'COP', 'CHERRY', 'ROBBER'];
  
  // Act - Call the function
  const result = checkBonusTrigger([row]);
  
  // Assert - Verify the result
  if (!result) {
    throw new Error('Expected bonus trigger with all conditions met');
  }
}
```

## Security Guidelines

Security is critical. Review our [Security Policy](.github/SECURITY.md) before contributing.

### Security Checklist

Before submitting a PR, verify:

- [ ] No `.env` files committed (use `.env.example` as template)
- [ ] No private keys, mnemonics, or passwords in code
- [ ] No API keys or tokens hardcoded
- [ ] All sensitive data loaded from environment variables
- [ ] No test secrets are real production credentials
- [ ] Input validation for user inputs
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies are up to date (`npm audit`)

### Handling Sensitive Data

**Never commit:**
- Private keys or mnemonics
- API keys (Etherscan, Infura, Alchemy)
- Wallet passwords or passphrases
- `.env` files with real credentials
- Production configuration files
- Database credentials

**Always:**
- Use environment variables for sensitive data
- Use `.env.example` as a template
- Test with fake/test credentials
- Review `git diff` before committing
- Use `.gitignore` patterns

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**:
   ```bash
   npm test
   ```

3. **Run security audit**:
   ```bash
   npm audit
   ```

4. **Review your changes**:
   ```bash
   git diff upstream/main
   ```

### Submitting Your PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers
   - Type of change (bug fix, feature, docs, etc.)
   - Testing performed
   - Screenshots (for UI changes)

4. **Wait for review** from maintainers

### PR Title Format

Use a clear, descriptive title:

```
Fix: Correct bonus trigger detection for edge case
Feat: Add rate limiting to faucet server
Docs: Update security policy with incident response
Test: Add tests for contract verification
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Fixes #123
Related to #456

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security fix

## Testing
Describe the tests you ran and their results.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] No sensitive data (keys, credentials) in code
- [ ] I have run `npm audit` and addressed issues
```

### Review Process

1. **Automated checks** will run (tests, builds, security scans)
2. **Maintainer review** (may request changes)
3. **Address feedback** by pushing new commits
4. **Approval and merge** by maintainer

### After Merge

1. **Delete your feature branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## License Agreement

**Important**: This project uses a proprietary license.

By contributing to this project, you agree that:

1. Your contributions will be licensed under the same proprietary license
2. You grant kushmanmb full rights to use, modify, and distribute your contributions
3. You have the right to submit the contributions (no third-party licenses conflict)
4. You understand that use of this software requires authorization from kushmanmb

### Contributor License Agreement (CLA)

For significant contributions, you may be asked to sign a Contributor License Agreement (CLA). This protects both you and the project.

## Getting Help

### Questions or Issues?

- **General questions**: Open a discussion or issue on GitHub
- **Security concerns**: Contact kushmanmb privately via GitHub
- **Bug reports**: Create an issue with detailed reproduction steps
- **Feature requests**: Create an issue describing the feature and use case

### Resources

- [README.md](README.md) - Project overview and getting started
- [CODING_GUIDELINES.md](CODING_GUIDELINES.md) - Detailed coding standards
- [FILES.md](FILES.md) - Project structure and file reference
- [SECURITY.md](.github/SECURITY.md) - Security policies and best practices
- [OWNERSHIP.md](OWNERSHIP.md) - Licensing and attribution

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes (for significant contributions)
- Project documentation (where appropriate)

Thank you for contributing to kushmanmb.org! 🎉
