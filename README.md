# Awesome Playwright Template

Playwright + TypeScript template that showcases a senior-level automation approach for both UI and API testing.

## What this repo demonstrates

- UI automation against `https://practicesoftwaretesting.com`
- API automation against `https://api.restful-api.dev`
- Root-level `pages/` for fast POM discovery
- `src/` support layers for clients, fixtures, data, and config
- Separate Playwright projects for UI and API execution
- CI-ready reporting, retries, traces, linting, and type checking

## Project structure

```text
pages/
  components/
  shop/
src/
  clients/
  config/
  data/
  fixtures/
  utils/
tests/
  api/
  ui/
```

## Why this structure

- `pages/` stays at the root because page objects are usually the first thing people look for in a UI automation repo.
- `src/` holds the reusable framework and business support code so tests stay readable.
- `tests/` remains execution-focused and grouped by capability, not by technical helper type.

## Getting started

```bash
npm install
npx playwright install chromium firefox
npm run check
npm test
```

Local Playwright scripts inject `.env.local`. CI Playwright scripts inject `.env.production`.

## Scripts

- `npm test` - run the full suite
- `npm run test:ui` - run the UI projects
- `npm run test:api` - run the API project
- `npm run test:headed` - run the Chromium UI project headed
- `npm run test:debug` - debug the Chromium UI project
- `npm run test:ci` - run the full suite with `.env.production`
- `npm run test:ui:ci` - run the UI projects with `.env.production`
- `npm run test:api:ci` - run the API project with `.env.production`
- `npm run report` - open the HTML report
- `npm run check` - lint + typecheck

## Environment loading

- Local Playwright scripts use `dotenvx run -f .env.local -- ...`.
- CI Playwright scripts use `dotenvx run -f .env.production -- ...`.
- `playwright.config.ts` and `src/config/global-setup.ts` validate the injected environment before tests run.
- API requests read `API_BASE_URL` and `API_KEY` from the active env file.
- Encrypted values add private keys to `.env.keys`, which should stay local and out of git; CI should provide `DOTENV_PRIVATE_KEY_PRODUCTION` as a GitHub secret.

## Design principles

- Thin POMs focused on user behavior and stable locators
- Playwright fixtures instead of inheritance-heavy base classes
- Hand-written API clients to keep the tests expressive and maintainable
- Deterministic test data factories for isolated runs
- Cross-browser UI execution and dedicated API execution project

## Notes

- The RESTful API tests use authenticated collections so each run can create, query, update, and delete its own records.
- The Practice Software Testing site is public, so UI assertions focus on user-visible behavior and stable interactions.

## Next steps

- Add schema validation for selected API responses to strengthen contract checks.
- Add test tags and filtered npm scripts for smoke, regression, and debug-friendly execution.
- Expand UI coverage with sign-in, checkout, and contact form scenarios once stability is verified.
- Add richer reporting such as blob reports and CI annotations for larger teams.
- Add contribution guidelines with naming, locator, fixture, and data-factory conventions.
