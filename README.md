[![Playwright](https://github.com/roman-pinchuk/awesome-pw-template/actions/workflows/playwright.yml/badge.svg)](https://github.com/roman-pinchuk/awesome-pw-template/actions/workflows/playwright.yml)

# Awesome Playwright Template

Playwright + TypeScript template that showcases a senior-level automation approach for both UI and API testing.

## What this repo demonstrates

- UI automation against `https://www.saucedemo.com`
- API automation against Supabase PostgREST
- Deep module structure: CRUD separated from assertions, thin page objects, resource lifecycle fixtures
- Separate Playwright projects for UI and API execution
- CI-ready reporting, retries, traces, linting, and type checking

## Project structure

```text
.
├── business/
│   ├── api/
│   │   ├── assertions/
│   │   │   └── object.assertions.ts
│   │   └── factories/
│   │       └── object.factory.ts
│   ├── checkout.ts
│   └── constants.ts
├── infrastructure/
│   ├── clients/
│   │   └── restful.client.ts
│   ├── config/
│   │   └── env.ts
│   ├── fixtures/
│   │   ├── api.fixture.ts
│   │   └── ui.fixture.ts
│   └── utils/
│       ├── api-assertions.ts
│       ├── logger.ts
│       └── random.ts
├── pages/
│   ├── components/
│   │   └── header.component.ts
│   ├── base.page.ts
│   ├── cart.page.ts
│   ├── checkout-complete.page.ts
│   ├── checkout-step-one.page.ts
│   ├── checkout-step-two.page.ts
│   ├── inventory.page.ts
│   ├── login.page.ts
│   └── product-detail.page.ts
├── tests/
│   ├── api/
│   │   ├── auth/
│   │   │   └── api-auth.spec.ts
│   │   └── objects/
│   │       ├── object-auth.spec.ts
│   │       ├── object-crud.spec.ts
│   │       ├── object-patch.spec.ts
│   │       └── object-query.spec.ts
│   ├── ui/
│   │   ├── cart-journey.spec.ts
│   │   ├── cart-remove.spec.ts
│   │   ├── checkout-flow.spec.ts
│   │   ├── inventory-filters.spec.ts
│   │   ├── login-validation.spec.ts
│   │   └── smoke.spec.ts
│   └── auth.setup.ts
├── .env.example
├── .env.production
├── .env.keys
├── eslint.config.mjs
├── package.json
├── playwright.config.ts
└── tsconfig.json
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
```

To run API tests, complete the [Supabase API setup](#supabase-api-setup) first, then:

```bash
npm run test:api    # API only
npm test            # Full suite (UI + API)
```

## Supabase API setup

The API tests run against a Supabase PostgREST endpoint. Here's how to set it up:

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up.
2. Create a new project — choose any name (e.g. `awesome-pw-tests`), generate a database password, pick the closest region, and select the **Free** plan.
3. Wait 1–2 minutes for the project to provision.

### 2. Create the table and RLS policy

Open the **SQL Editor** in your Supabase dashboard and run:

```sql
create table objects (
  id uuid default gen_random_uuid() primary key,
  "collectionName" text not null,
  name text not null,
  data jsonb default '{}'::jsonb,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

alter table objects enable row level security;

create policy "anon_crud" on objects
  for all
  using (true)
  with check (true);
```

### 3. Configure environment variables

Go to **Settings → Data API** in your Supabase dashboard and copy:

- **Project URL** (e.g. `https://abc123.supabase.co`)
- **anon public** key

Add them to your env files:

```env
# .env.local (local development)
API_BASE_URL=https://<your-project>.supabase.co
API_KEY=<your-supabase-anon-key>
```

```env
# .env.production (CI, encrypted)
API_BASE_URL=https://<your-project>.supabase.co
API_KEY=<your-supabase-anon-key>
```

For CI, encrypt `.env.production` using dotenvx:

```bash
npx dotenvx encrypt
```

### 4. Run the API tests

```bash
npm run test:api
```

## Scripts

### Local development

| Script | Description |
|--------|-------------|
| `npm test` | Run the full suite (UI + API) |
| `npm run test:ui` | Run SauceDemo across Chromium, Firefox, WebKit |
| `npm run test:api` | Run API tests against the configured Supabase project |
| `npm run test:headed` | Run SauceDemo Chromium in headed mode |
| `npm run test:debug` | Debug SauceDemo Chromium |
| `npm run report` | Open the HTML test report |
| `npm run check` | Lint + typecheck |

### CI

| Script | Description |
|--------|-------------|
| `npm run test:ci` | Full suite via encrypted `.env.production` |
| `npm run test:ui:ci` | UI tests via encrypted `.env.production` |
| `npm run test:api:ci` | API tests via encrypted `.env.production` |

## Environment loading

- **Local** — `infrastructure/config/env.ts` loads `.env.local` via `@dotenvx/dotenvx` when `CI` is not set. `API_BASE_URL` and `API_KEY` are validated at startup.
- **CI** — the `test:*:ci` scripts use `dotenvx run -f .env.production` to decrypt and inject the encrypted `.env.production` file.
- `playwright.config.ts` and `infrastructure/config/env.ts` validate the injected environment before tests run.
- API requests read `API_BASE_URL` (Supabase project URL) and `API_KEY` (anon key) from the active env file.
