import prompts from 'prompts';
import { execSync } from 'node:child_process';
import { rmSync, existsSync, readFileSync } from 'node:fs';

const CONFIG  = '--config=playwright-framework/playwright.config.ts';
const BACK    = { title: '← Go Back', value: '__back__' };
const CANCEL  = () => process.exit(0);

const REPORT_DIRS = [
  'playwright-framework/playwright-report',
  'allure-results',
  'test-results',
];

const UI_SPECS = [
  { title: 'Login',        value: 'playwright-framework/tests/ui/login.spec.ts'        },
  { title: 'Cart',         value: 'playwright-framework/tests/ui/cart.spec.ts'         },
  { title: 'Checkout',     value: 'playwright-framework/tests/ui/checkout.spec.ts'     },
  { title: 'Main Page',    value: 'playwright-framework/tests/ui/mainpage.spec.ts'     },
  { title: 'Navigation',   value: 'playwright-framework/tests/ui/navigation.spec.ts'   },
  { title: 'Product Page', value: 'playwright-framework/tests/ui/product.spec.ts'      },
  { title: 'Broken Users', value: 'playwright-framework/tests/ui/broken-users.spec.ts' },
  BACK,
];

const API_SPECS = [
  { title: 'Filtering',  value: 'playwright-framework/tests/api/filtering.spec.ts'  },
  { title: 'CRUD',       value: 'playwright-framework/tests/api/crud.spec.ts'       },
  { title: 'Auth',       value: 'playwright-framework/tests/api/auth.spec.ts'       },
  { title: 'Validation', value: 'playwright-framework/tests/api/validation.spec.ts' },
  BACK,
];

function getTestCases(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/^\s*test\s*\(\s*['"`](.*?)['"`]/gm);
  return Array.from(matches).map(m => m[1]);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main(): Promise<void> {
  console.log('\n  🎭  Playwright Test Runner\n');

  let step        = 'main';
  let testType    = '';
  let specFile    = '';
  let headed      = false;
  let slowmo      = 0;
  let grepPattern = '';

  while (true) {

    // ── MAIN MENU ──────────────────────────────────────────────────────────
    if (step === 'main') {
      headed      = false;
      slowmo      = 0;
      specFile    = '';
      grepPattern = '';

      const { choice } = await prompts({
        type:    'select',
        name:    'choice',
        message: 'What do you want to run?',
        choices: [
          { title: 'Full Regression Suite',  value: 'all'          },
          { title: 'All UI  (Chrome)',        value: 'ui'           },
          { title: 'All API',                 value: 'api'          },
          { title: 'Specific UI page',        value: 'ui-specific'  },
          { title: 'Specific API spec',       value: 'api-specific' },
          { title: '🗑  Clean reports',        value: 'clean'        },
        ],
      }, { onCancel: CANCEL });

      testType = choice;

      if (choice === 'clean')        { step = 'clean';    continue; }
      if (choice === 'ui-specific')  { step = 'ui-page';  continue; }
      if (choice === 'api-specific') { step = 'api-spec'; continue; }
      if (choice === 'api')          { step = 'run';      continue; }
      if (choice === 'all')          { step = 'run';      continue; }
      step = 'headed';
      continue;
    }

    // ── UI PAGE SELECTION ──────────────────────────────────────────────────
    if (step === 'ui-page') {
      const { spec } = await prompts({
        type:    'select',
        name:    'spec',
        message: 'Select a UI page:',
        choices: UI_SPECS,
      }, { onCancel: CANCEL });

      if (spec === '__back__') { step = 'main'; continue; }
      specFile = spec;
      step = 'test-case';
      continue;
    }

    // ── API SPEC SELECTION ─────────────────────────────────────────────────
    if (step === 'api-spec') {
      const { spec } = await prompts({
        type:    'select',
        name:    'spec',
        message: 'Select an API spec:',
        choices: API_SPECS,
      }, { onCancel: CANCEL });

      if (spec === '__back__') { step = 'main'; continue; }
      specFile = spec;
      step = 'test-case';
      continue;
    }

    // ── TEST CASE SELECTION ────────────────────────────────────────────────
    if (step === 'test-case') {
      const cases = getTestCases(specFile);
      const { choice } = await prompts({
        type:    'select',
        name:    'choice',
        message: 'Select a test case:',
        choices: [
          { title: '▶  Run all tests in this file', value: '__all__' },
          ...cases.map(c => ({ title: c, value: c })),
          BACK,
        ],
      }, { onCancel: CANCEL });

      if (choice === '__back__') {
        step = testType === 'ui-specific' ? 'ui-page' : 'api-spec';
        continue;
      }
      grepPattern = choice === '__all__' ? '' : escapeRegex(choice);
      step = testType === 'ui-specific' ? 'headed' : 'run';
      continue;
    }

    // ── HEADED MODE ────────────────────────────────────────────────────────
    if (step === 'headed') {
      const { choice } = await prompts({
        type:    'select',
        name:    'choice',
        message: 'Run with browser visible?',
        choices: [
          { title: 'No  — headless (faster)', value: 'no'       },
          { title: 'Yes — show browser',      value: 'yes'      },
          BACK,
        ],
      }, { onCancel: CANCEL });

      if (choice === '__back__') {
        step = testType === 'ui-specific' ? 'test-case' : 'main';
        continue;
      }
      headed = choice === 'yes';
      step   = headed ? 'slowmo' : 'run';
      continue;
    }

    // ── SLOW MOTION ────────────────────────────────────────────────────────
    if (step === 'slowmo') {
      const { choice } = await prompts({
        type:    'select',
        name:    'choice',
        message: 'Slow motion delay:',
        choices: [
          { title: 'None',            value: 0    },
          { title: 'Slow   (500ms)',  value: 500  },
          { title: 'Slower (1000ms)', value: 1000 },
          { title: 'Crawl  (2000ms)', value: 2000 },
          BACK,
        ],
      }, { onCancel: CANCEL });

      if (choice === '__back__') { step = 'headed'; continue; }
      slowmo = choice;
      step   = 'run';
      continue;
    }

    // ── CLEAN REPORTS ──────────────────────────────────────────────────────
    if (step === 'clean') {
      const { confirm } = await prompts({
        type:    'select',
        name:    'confirm',
        message: 'Delete all screenshots, videos and report files?',
        choices: [
          { title: 'Yes — delete everything', value: 'yes' },
          BACK,
        ],
      }, { onCancel: CANCEL });

      if (confirm === '__back__') { step = 'main'; continue; }

      console.log('');
      let cleaned = 0;
      for (const dir of REPORT_DIRS) {
        if (existsSync(dir)) {
          rmSync(dir, { recursive: true, force: true });
          console.log(`  🗑  Deleted: ${dir}`);
          cleaned++;
        } else {
          console.log(`  –  Not found: ${dir}`);
        }
      }
      console.log(cleaned > 0 ? '\n  ✅  Done.\n' : '\n  Nothing to clean.\n');
      break;
    }

    // ── BUILD AND RUN ──────────────────────────────────────────────────────
    if (step === 'run') {
      let command = `npx playwright test ${CONFIG}`;

      if (testType === 'ui' || testType === 'ui-specific') command += ' --project=ui-chrome';
      if (testType === 'api' || testType === 'api-specific') command += ' --project=api';
      if (specFile)                          command += ` ${specFile}`;
      if (headed)                            command += ' --headed --workers=1';
      if (!headed)                           command += ' --workers=4';
      if (grepPattern)                       command += ` --grep "${grepPattern}"`;

      const env: NodeJS.ProcessEnv = { ...process.env };
      if (slowmo > 0) env.SLOWMO = String(slowmo);

      console.log(`\n  ▶  ${command}\n`);
      try {
        execSync(command, { stdio: 'inherit', env });
      } catch (err: any) {
        // status 1 = Playwright found test failures — results already printed above
        if (err?.status !== 1) throw err;
      }
      break;
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
