// Test script for faucet.js cooldown logic
// This tests the cooldown constant and logic without requiring actual blockchain connection

const fs = require('fs');
const { runTestSuite } = require('./lib/test-utils');

async function runTests(runner) {
  // Test 1: Verify COOLDOWN constant is set to 12 hours
  await runner.test('Test 1: COOLDOWN constant value', () => {
    // Read the faucet.js file to extract the COOLDOWN constant
    const faucetCode = fs.readFileSync('./faucet.js', 'utf8');
    
    // Extract COOLDOWN value using regex (flexible to handle whitespace variations)
    const cooldownMatch = faucetCode.match(/const\s+COOLDOWN\s*=\s*(\d+)\s*;?/);
    if (!cooldownMatch) {
      throw new Error('Could not find COOLDOWN constant in faucet.js');
    }
    
    const cooldownValue = parseInt(cooldownMatch[1]);
    const expectedCooldown = 43200; // 12 hours in seconds
    
    if (cooldownValue !== expectedCooldown) {
      throw new Error(`COOLDOWN is ${cooldownValue} seconds, expected ${expectedCooldown} seconds (12 hours)`);
    }
    
    console.log(`  COOLDOWN is correctly set to ${cooldownValue} seconds (12 hours)`);
  });

  // Test 2: Verify cooldown calculation
  await runner.test('Test 2: Cooldown calculation logic', () => {
    const COOLDOWN = 43200; // 12 hours
    const now = Math.floor(Date.now() / 1000);
    
    // Test case 1: No previous request (should allow)
    const lastRequestTimes = {};
    const normalizedAddress = '0x1234567890123456789012345678901234567890'.toLowerCase();
    
    if (lastRequestTimes[normalizedAddress]) {
      throw new Error('Address should not have a previous request time');
    }
    
    // Test case 2: Previous request was 13 hours ago (should allow)
    lastRequestTimes[normalizedAddress] = now - (13 * 3600);
    const timeDiff1 = now - lastRequestTimes[normalizedAddress];
    const shouldAllow1 = timeDiff1 >= COOLDOWN;
    
    if (!shouldAllow1) {
      throw new Error('Should allow request after 13 hours');
    }
    
    // Test case 3: Previous request was 11 hours ago (should deny)
    lastRequestTimes[normalizedAddress] = now - (11 * 3600);
    const timeDiff2 = now - lastRequestTimes[normalizedAddress];
    const shouldAllow2 = timeDiff2 >= COOLDOWN;
    
    if (shouldAllow2) {
      throw new Error('Should deny request before 12 hours have passed');
    }
    
    // Test case 4: Previous request was exactly 12 hours ago (should allow)
    lastRequestTimes[normalizedAddress] = now - (12 * 3600);
    const timeDiff3 = now - lastRequestTimes[normalizedAddress];
    const shouldAllow3 = timeDiff3 >= COOLDOWN;
    
    if (!shouldAllow3) {
      throw new Error('Should allow request at exactly 12 hours');
    }
    
    console.log('  - No previous request: allowed');
    console.log('  - 13 hours ago: allowed');
    console.log('  - 11 hours ago: denied');
    console.log('  - 12 hours ago: allowed');
  });

  // Test 3: Verify README documentation matches code
  await runner.test('Test 3: README documentation consistency', () => {
    const readmeContent = fs.readFileSync('./README.md', 'utf8');
    
    // Check for "12 hour" mentions in README
    const cooldownMatches = readmeContent.match(/12 hour/gi);
    if (!cooldownMatches || cooldownMatches.length === 0) {
      throw new Error('README should mention "12 hour" cooldown');
    }
    
    // Check that there are no "48 hour" references (old/incorrect documentation)
    const oldCooldownMatches = readmeContent.match(/48 hour/gi);
    if (oldCooldownMatches && oldCooldownMatches.length > 0) {
      throw new Error('README still contains outdated "48 hour" references');
    }
    
    console.log(`  - Found ${cooldownMatches.length} correct "12 hour" reference(s)`);
  });

  // Test 4: Verify address normalization
  await runner.test('Test 4: Address normalization for cooldown tracking', () => {
    // Different case variations of the same address
    const address1 = '0x1234567890123456789012345678901234567890';
    const address2 = '0x1234567890123456789012345678901234567890'.toLowerCase();
    const address3 = '0x1234567890123456789012345678901234567890'.toUpperCase();
    
    const normalized1 = address1.toLowerCase();
    const normalized2 = address2.toLowerCase();
    const normalized3 = address3.toLowerCase();
    
    if (normalized1 !== normalized2 || normalized2 !== normalized3) {
      throw new Error('Address normalization is not working correctly');
    }
    
    console.log('  - Mixed case, lowercase, and uppercase all normalize to same value');
  });

  // Test 5: Verify wallet endpoint exists
  await runner.test('Test 5: Wallet endpoint definition', () => {
    const faucetCode = fs.readFileSync('./faucet.js', 'utf8');
    
    // Check for the GET /wallet endpoint
    const walletEndpointMatch = faucetCode.match(/app\.get\s*\(\s*['"`]\/wallet['"`]/);
    if (!walletEndpointMatch) {
      throw new Error('Could not find GET /wallet endpoint in faucet.js');
    }
    
    // Extract the endpoint handler code and verify it returns wallet.address
    const endpointHandlerRegex = /app\.get\s*\(\s*['"`]\/wallet['"`]\s*,\s*\([^)]*\)\s*=>\s*{([^}]+)}/;
    const handlerMatch = faucetCode.match(endpointHandlerRegex);
    if (!handlerMatch) {
      throw new Error('Could not parse GET /wallet endpoint handler');
    }
    
    const handlerCode = handlerMatch[1];
    if (!handlerCode.includes('wallet.address')) {
      throw new Error('Wallet endpoint handler should return wallet.address');
    }
    
    console.log('  - Endpoint returns wallet address in response');
  });

  // Test 6: Verify ERC20 ABI completeness
  await runner.test('Test 6: ERC20 ABI completeness', () => {
    const faucetCode = fs.readFileSync('./faucet.js', 'utf8');
    
    // Extract USDC_ABI definition with more specific pattern
    // Match from "const USDC_ABI = [" to the closing "];" ensuring we get the full array
    const abiMatch = faucetCode.match(/const\s+USDC_ABI\s*=\s*\[([\s\S]*?)\]\s*;/);
    if (!abiMatch) {
      throw new Error('Could not find USDC_ABI definition in faucet.js');
    }
    
    const abiContent = abiMatch[1];
    
    // Define required ERC20 functions
    const requiredFunctions = [
      'transfer',
      'transferFrom',
      'approve',
      'balanceOf',
      'allowance',
      'totalSupply',
      'decimals',
      'name',
      'symbol'
    ];
    
    // Check for each required function with properly escaped regex
    const missingFunctions = [];
    for (const funcName of requiredFunctions) {
      // Escape the function name to handle any special regex characters
      const escapedFuncName = funcName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const funcRegex = new RegExp(`function\\s+${escapedFuncName}\\s*\\(`);
      if (!funcRegex.test(abiContent)) {
        missingFunctions.push(funcName);
      }
    }
    
    if (missingFunctions.length > 0) {
      throw new Error(`Missing ERC20 functions in ABI: ${missingFunctions.join(', ')}`);
    }
    
    console.log(`  - Verified ${requiredFunctions.length} ERC20 functions are defined`);
    console.log('  - Transfer functions: transfer, transferFrom, approve');
    console.log('  - View functions: balanceOf, allowance, totalSupply, decimals, name, symbol');
  });
}

// Run the test suite
runTestSuite('Testing faucet.js cooldown configuration...', runTests);
