# Playwright TypeScript Framework

End-to-end test framework built with Playwright and TypeScript, covering UI tests against [SauceDemo](https://www.saucedemo.com) and API tests against [Restful Booker](https://restful-booker.herokuapp.com).

## Quick Start — Single Command

Clone the repo and run:

```bash
npm start
```

This installs all dependencies, installs Playwright browsers, and executes the full regression suite (UI + API) in a single step.

---

## Project Structure

```
playwright-framework/
├── config/
│   ├── .env.staging             # Staging environment variables
│   └── .env.production          # Production environment variables
├── fixtures/
│   ├── ui.fixtures.ts           # Page object fixtures + authenticatedPage
│   └── api.fixtures.ts          # bookingAPI + authenticatedBookingAPI fixtures
├── pages/
│   ├── ui-pages/
│   │   ├── base.page.ts         # Abstract base page (shared locators + methods)
│   │   ├── login.page.ts        # Login page
│   │   ├── inventory.page.ts    # Inventory / main shop page
│   │   ├── cart.page.ts         # Cart page
│   │   ├── product.page.ts      # Product detail page
│   │   └── checkout.page.ts     # Checkout step 1 & 2 + confirmation
│   └── api-pages/
│       ├── base.api.ts          # Abstract HTTP client (GET, POST, PUT, PATCH, DELETE)
│       └── booking.api.ts       # Restful Booker API client extending BaseAPI
├── reporters/
│   └── steps-reporter.ts        # Custom terminal reporter with step-by-step output
├── test-data/
│   ├── users.ts                 # All SauceDemo user types + API admin credentials
│   ├── bookings.ts              # Valid and invalid booking payloads + TypeScript interfaces
│   ├── products.ts              # All SauceDemo product names, IDs and prices
│   └── checkout.ts              # Shipping info payloads for checkout tests
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts        # Login, logout, session, error dismiss
│   │   ├── mainpage.spec.ts     # Cart badge, sorting filters, footer links
│   │   ├── cart.spec.ts         # Cart operations, item counts, prices
│   │   ├── checkout.spec.ts     # Full checkout flow, validation, cancel, totals
│   │   ├── product.spec.ts      # Product detail page navigation and add-to-cart
│   │   ├── navigation.spec.ts   # Burger menu, logout, reset app state
│   │   └── broken-users.spec.ts # Problem/Performance/Error/Visual user behaviour
│   └── api/
│       ├── auth.spec.ts         # Token generation, status codes
│       ├── crud.spec.ts         # Full create → read → update → patch → delete lifecycle
│       ├── filtering.spec.ts    # Booking filters by name and date
│       └── validation.spec.ts   # Negative cases (invalid payloads, bad auth)
├── utils/
│   └── helpers.ts               # Utility functions (random data, dates, retry, query strings)
├── .env                         # Default environment variables (loaded at runtime)
├── global-setup.ts              # Cleans up stale report/screenshot files before each run
└── playwright.config.ts         # Central Playwright configuration
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Setup

For subsequent runs after the initial `npm start`, you can run tests directly:

```bash
npm test
```

To install dependencies and browsers separately:

```bash
npm install
npx playwright install
```

---

## Environment Configuration

The default `.env` file is loaded automatically on every run:

```
playwright-framework/.env         ← default (used unless overridden)
playwright-framework/config/.env.staging
playwright-framework/config/.env.production
```

To run against a different environment, use the dedicated npm scripts:

```bash
npm run test:staging
npm run test:production
```

---

## Running Tests

### Interactive Menu (recommended)

The easiest way to run tests. Presents a guided CLI menu to select suite, browser mode, slow-motion speed, and individual test cases:

```bash
npm run menu
```

Menu options:
- **Full Regression Suite** — all UI (Chrome + Firefox) and API tests
- **All UI (Chrome)** — every UI spec in Chrome
- **All API** — every API spec
- **Specific UI page** — pick a spec file, then optionally a single test case
- **Specific API spec** — pick a spec file, then optionally a single test case
- **Clean reports** — delete `playwright-report/`, `allure-results/`, `test-results/`

When running UI tests you are also prompted for:
- Headed or headless browser
- Slow-motion delay (None / 500ms / 1000ms / 2000ms)

---

### npm Scripts

#### Full suites

| Command | What it runs |
|---|---|
| `npm test` | All tests (all projects) |
| `npm run test:ui` | All UI tests |
| `npm run test:api` | All API tests |
| `npm run test:headed` | All UI tests with browser visible |
| `npm run test:staging` | All tests against staging environment |
| `npm run test:production` | All tests against production environment |

#### Individual UI spec files

| Command | Spec file |
|---|---|
| `npm run test:login` | `tests/ui/login.spec.ts` |
| `npm run test:cart` | `tests/ui/cart.spec.ts` |
| `npm run test:checkout` | `tests/ui/checkout.spec.ts` |
| `npm run test:mainpage` | `tests/ui/mainpage.spec.ts` |
| `npm run test:navigation` | `tests/ui/navigation.spec.ts` |
| `npm run test:product` | `tests/ui/product.spec.ts` |
| `npm run test:broken-users` | `tests/ui/broken-users.spec.ts` |
| `npm run test:broken-users:baseline` | Creates / refreshes the visual baseline from the standard user only — run this once before running broken-users normally |
| `npm run test:broken-users:update` | Updates all snapshots including the visual user — use only when intentionally resetting all baselines |

#### Individual API spec files

| Command | Spec file |
|---|---|
| `npm run test:auth` | `tests/api/auth.spec.ts` |
| `npm run test:crud` | `tests/api/crud.spec.ts` |
| `npm run test:filtering` | `tests/api/filtering.spec.ts` |
| `npm run test:validation` | `tests/api/validation.spec.ts` |

#### Reports

```bash
npm run test:report    # Open the Playwright HTML report in the browser
```

---

## Reports

### Playwright HTML Report

Generated automatically after every run into `playwright-framework/playwright-report/`.

```bash
npm run test:report
```

### Allure Report

Results are written to `allure-results/` after every run. To generate and open the full Allure dashboard, install the CLI once:

```bash
npm install -g allure-commandline
```

Then:

```bash
allure generate allure-results -o allure-report --clean
allure open allure-report
```

### Terminal Steps Reporter

A custom reporter prints a live step-by-step breakdown in the terminal after each test — pass/fail icon, test name, each numbered step, and a summary of assertion errors on failure. No extra setup needed; it runs automatically.

---

## Test Coverage

### UI Tests — SauceDemo

| Spec | Scenarios covered |
|---|---|
| **login** | Valid login, locked/invalid/empty credentials, error dismiss, logout + session check |
| **mainpage** | Cart badge add/remove, sorting (A-Z, Z-A, price low-high, price high-low), footer social links |
| **cart** | Empty cart, add item, remove item, multi-item, prices, continue shopping |
| **checkout** | Full happy path, field validation, cancel on step 1 & 2, order summary, subtotal, tax |
| **product** | Navigate to detail page, verify name/price/description, add to cart from detail |
| **navigation** | Menu open, About redirect, logout redirect, All Items from cart, Reset App State |
| **broken-users** | Problem user (broken images), performance user (slow login), error user (form bug), visual user (screenshot diff) |

### API Tests — Restful Booker

| Spec | Scenarios covered |
|---|---|
| **auth** | Valid credentials return token, endpoint returns HTTP 200 |
| **crud** | Create → Read → Full update (PUT) → Partial update (PATCH) → Delete → Verify 404 |
| **filtering** | Filter by firstname, lastname, checkin date, checkout date, non-existent name |
| **validation** | Non-numeric totalprice, missing required field, checkin after checkout, invalid auth credentials |

> Validation and some filtering tests use `test.fail()` to document confirmed API bugs — they are expected to fail and are tracked intentionally.

---

## Key Design Decisions

- **Page Object Model** — all UI selectors and interactions live in `pages/ui-pages/`; all API clients live in `pages/api-pages/`. Tests call methods, never raw locators.
- **Base abstractions** — `BasePage` (shared nav/menu methods) and `BaseAPI` (shared HTTP methods) eliminate duplication across all page and API classes.
- **Custom fixtures** — `fixtures/` wires up page objects and API clients. The `authenticatedPage` fixture logs in automatically so tests that need a session start on the inventory page with zero setup code.
- **Test data separation** — `test-data/` keeps all payloads and credentials out of test files. TypeScript interfaces with `satisfies` give compile-time type checking on every data object.
- **Environment config** — `.env` is the default; `config/.env.staging` and `.env.production` override per environment. No URLs or credentials are hardcoded in tests.
- **Parallel execution** — `fullyParallel: true` with 4 local workers / 2 CI workers. UI and API suites run concurrently.
- **Retry strategy** — 0 retries locally for fast feedback; 2 retries in CI to handle flakiness. Video and trace capture activate on the first retry only.
- **Artifact capture** — screenshots on every test; video and trace recorded for all tests and retained only on failure — all attached to the HTML and Allure reports per failing test.
- **Global setup** — `global-setup.ts` prunes stale files from `allure-results/`, `test-results/`, and `screenshots/` before each run (keeps the 30 most recent).
