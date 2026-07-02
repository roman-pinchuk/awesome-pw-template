# Awesome Playwright Template

Playwright + TypeScript template that showcases a senior-level automation approach for both UI and API testing.

## What this repo demonstrates

- UI automation against `https://www.saucedemo.com`
- API automation against `https://api.restful-api.dev`
- Deep module structure: CRUD separated from assertions, thin page objects, resource lifecycle fixtures
- Separate Playwright projects for UI and API execution
- CI-ready reporting, retries, traces, linting, and type checking

## Project structure

```text
  business/
    constants.ts         # SauceDemo URLs, products, users
    checkout.ts          # Checkout customer info type + default
    api/
      clients/            # Pure CRUD clients — no assertions, no test framework deps
      assertions/         # Composable assertion helpers for API responses
      factories/          # Deterministic test data builders
  pages/                # SauceDemo page objects — thin, behavior-focused
  pages/components/     # Reusable UI fragments (e.g. HeaderComponent)
  infrastructure/
    fixtures/             # Playwright custom fixtures — dependency injection layer
    config/               # Zod-validated environment config + global setup
    utils/                # Logger, random generators, generic assertion helpers
  tests/
    ui/                   # SauceDemo E2E specs
    api/                  # API specs
    auth.setup.ts         # Global auth setup (TTL-cached storage state)
```

## Design principles

- **Deep modules over shallow wrappers** — API client interface is 6 methods (CRUD only); assertions are composed separately
- **Thin POMs via composition, not inheritance** — pages stay standalone with a lightweight base
- **Fixture-managed resource lifecycles** — collection scopes per test, auto-generated via fixture
- **Deterministic data factories** — every test creates its own data; no shared state
- **Extracted auth** — login uses a page object and TTL-cached storage state

## Getting started

```bash
npm install
npx playwright install chromium firefox
npm run check
npm test
```

Local Playwright scripts inject `.env.local`. CI Playwright scripts inject `.env.production`.

## Scripts

- `npm test` — run the full suite
- `npm run test:ui` — run SauceDemo across Chromium, Firefox, WebKit
- `npm run test:headed` — run SauceDemo Chromium headed
- `npm run test:debug` — debug SauceDemo Chromium
- `npm run report` — open the HTML report
- `npm run check` — lint + typecheck

## Environment loading

- Local Playwright scripts use `dotenvx run -f .env.local -- ...`.
- CI Playwright scripts use `dotenvx run -f .env.production -- ...`.
- `playwright.config.ts` and `infrastructure/config/env.ts` validate the injected environment before tests run.
- API requests read `API_BASE_URL` and `API_KEY` from the active env file.
