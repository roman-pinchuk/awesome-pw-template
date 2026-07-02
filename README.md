# Awesome Playwright Template

Playwright + TypeScript template that showcases a senior-level automation approach for both UI and API testing.

## What this repo demonstrates

- UI automation against `https://practicesoftwaretesting.com`
- API automation against `https://api.restful-api.dev`
- Deep module structure: CRUD separated from assertions, thin page objects, resource lifecycle fixtures
- Separate Playwright projects for UI and API execution
- CI-ready reporting, retries, traces, linting, and type checking

## Project structure

```text
src/
  api/
    clients/            # Pure CRUD clients — no assertions, no test framework deps
    assertions/         # Composable assertion helpers for API responses
    factories/          # Deterministic test data builders
  ui/
    pages/
      shop/             # Page objects — thin, behavior-focused, share a BasePage
      base.page.ts      # Lightweight base removing constructor boilerplate
    components/         # Reusable UI fragments (e.g. HeaderComponent)
    factories/          # Named product and catalog references
    mocks/              # page.route() interceptors for API isolation
    auth/               # Importable login helpers (shared by setup + tests)
  fixtures/             # Playwright custom fixtures — dependency injection layer
  config/               # Zod-validated environment config + global setup
  utils/                # Logger, random generators, generic assertion helpers
tests/
  ui/{smoke,catalog,cart,checkout,auth,contact,visual}/
  api/{objects,auth}/
docs/
  CONTEXT.md            # Domain glossary (Toolshop + RESTful API concepts)
  adr/                  # Architecture Decision Records
```

## Design principles

- **Deep modules over shallow wrappers** — API client interface is 6 methods (CRUD only); assertions are composed separately
- **Thin POMs via composition, not inheritance** — one `BasePage` removes boilerplate; pages stay standalone
- **Fixture-managed resource lifecycles** — collection scopes per test, auto-generated via fixture
- **Deterministic data factories** — every test creates its own data; no shared state
- **Opt-in API mocking** — `page.route()` interceptors isolate UI tests from downstream changes
- **Extracted auth** — login is a module, not a setup script; importable from any test

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
- `npm run test:ui` — run the UI projects
- `npm run test:api` — run the API project
- `npm run test:headed` — run the Chromium UI project headed
- `npm run test:debug` — debug the Chromium UI project
- `npm run test:ci` — run the full suite with `.env.production`
- `npm run test:ui:ci` — run the UI projects with `.env.production`
- `npm run test:api:ci` — run the API project with `.env.production`
- `npm run report` — open the HTML report
- `npm run check` — lint + typecheck

## Environment loading

- Local Playwright scripts use `dotenvx run -f .env.local -- ...`.
- CI Playwright scripts use `dotenvx run -f .env.production -- ...`.
- `playwright.config.ts` and `infrastructure/config/env.ts` validate the injected environment before tests run.
- API requests read `API_BASE_URL` and `API_KEY` from the active env file.
- Encrypted values add private keys to `.env.keys`, which should stay local and out of git; CI should provide `DOTENV_PRIVATE_KEY_PRODUCTION` as a GitHub secret.
