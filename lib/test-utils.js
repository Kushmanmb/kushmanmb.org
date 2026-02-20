/**
 * Shared test utilities for consistent test reporting across test files
 */

/**
 * Test runner class that provides consistent test execution and reporting
 */
class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * Run a test case
   * @param {string} name - Test name/description
   * @param {Function} testFn - Test function to execute
   */
  async test(name, testFn) {
    console.log(`\n${name}`);
    try {
      await testFn();
      console.log('✓ PASSED');
      this.passed++;
    } catch (error) {
      console.error('✗ FAILED:', error.message);
      this.failed++;
    }
  }

  /**
   * Print test summary and exit with appropriate code
   */
  printSummaryAndExit() {
    console.log('\n' + '='.repeat(50));
    console.log('Test Summary:');
    console.log(`  Passed: ${this.passed}`);
    console.log(`  Failed: ${this.failed}`);
    console.log(`  Total:  ${this.passed + this.failed}`);

    if (this.failed > 0) {
      console.log('\n✗ Some tests failed');
      process.exit(1);
    } else {
      console.log('\n✓ All tests passed');
      process.exit(0);
    }
  }

  /**
   * Get current test statistics
   */
  getStats() {
    return {
      passed: this.passed,
      failed: this.failed,
      total: this.passed + this.failed,
    };
  }
}

/**
 * Run a suite of tests with error handling
 * @param {string} suiteName - Name of the test suite
 * @param {Function} testsFn - Async function containing test cases
 */
async function runTestSuite(suiteName, testsFn) {
  console.log(`${suiteName}\n`);
  
  const runner = new TestRunner();
  
  try {
    await testsFn(runner);
    runner.printSummaryAndExit();
  } catch (error) {
    console.error('Test suite error:', error);
    process.exit(1);
  }
}

module.exports = {
  TestRunner,
  runTestSuite,
};
