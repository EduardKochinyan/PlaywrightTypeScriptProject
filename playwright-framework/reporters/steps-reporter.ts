import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

const PASS_ICON  = '✅';
const FAIL_ICON  = '❌';
const LINE       = '─'.repeat(70);
const GREEN      = '\x1b[32m';
const RED        = '\x1b[31m';
const BOLD       = '\x1b[1m';
const RESET      = '\x1b[0m';

class StepsReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'skipped') {
      this.skipped++;
      return;
    }

    const ok               = result.status === test.expectedStatus;
    const expectedFailure  = result.status === 'failed' && test.expectedStatus === 'failed';
    if (ok) this.passed++; else this.failed++;
    const icon   = ok ? PASS_ICON : FAIL_ICON;
    const color  = ok ? GREEN : RED;
    const label  = expectedFailure ? 'EXPECTED FAILURE' : ok ? 'PASSED' : 'FAILED';
    process.stdout.write('\n' + LINE + '\n');
    process.stdout.write(`${color}${BOLD}${icon} ${label}${RESET}: ${test.title}\n`);
    process.stdout.write(LINE + '\n\n');

    const userSteps = result.steps.filter(s => s.category === 'test.step');
    const steps = userSteps.length > 0
      ? userSteps
      : result.steps.filter(s => s.category === 'expect');

    steps.forEach((step, i) => {
      const stepIcon = step.error ? FAIL_ICON : PASS_ICON;
      process.stdout.write(`  ${i + 1}. ${stepIcon}  ${step.title}\n`);
    });

    if (result.error?.message && !expectedFailure) {
      process.stdout.write(`\n  ${RED}${BOLD}Error Details:${RESET}\n`);
      result.error.message
        .split('\n')
        .filter(l => /expected|received|actual/i.test(l))
        .forEach(l => process.stdout.write(`    ${l.trim()}\n`));
    }

    process.stdout.write('\n' + LINE + '\n');
  }

  onEnd(_result: FullResult): void {
    const total = this.passed + this.failed + this.skipped;
    const DOUBLE = '═'.repeat(70);
    process.stdout.write('\n' + DOUBLE + '\n');
    process.stdout.write(`${BOLD}Test Run Summary${RESET}\n`);
    process.stdout.write(`  Total:   ${total}\n`);
    process.stdout.write(`  ${GREEN}${BOLD}Passed:  ${this.passed}${RESET}\n`);
    if (this.failed > 0) {
      process.stdout.write(`  ${RED}${BOLD}Failed:  ${this.failed}${RESET}\n`);
    }
    if (this.skipped > 0) {
      process.stdout.write(`  Skipped: ${this.skipped}\n`);
    }
    process.stdout.write(DOUBLE + '\n\n');
  }

  printsToStdio(): boolean {
    return true;
  }
}

export default StepsReporter;
