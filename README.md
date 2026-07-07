# Awesome Playwright Template

[![CI](https://github.com/roman-pinchuk/awesome-pw-template/actions/workflows/playwright.yml/badge.svg)](https://github.com/roman-pinchuk/awesome-pw-template/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.61.1-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)
![Test scope](https://img.shields.io/badge/tests-UI%20%2B%20API-blue)

Playwright + TypeScript template that showcases a senior-level automation
approach for both UI and API testing.

<!-- START_MATRIX_TABLE -->

### Dynamic Dependency & Security Matrix

The Snyk workflow replaces this block with dependency versions and current
security status after scheduled or `main` branch runs.

<!-- END_MATRIX_TABLE -->

## What this repo demonstrates

- UI automation against `https://www.saucedemo.com`
- API automation against Supabase PostgREST
- Deep module structure: CRUD separated from assertions, thin page objects,
  resource lifecycle fixtures
- Separate Playwright projects for UI and API execution
- CI-ready reporting, retries, traces, linting, type checking, and local Git
  hooks

## Project structure

```mermaid
flowchart TB
    classDef testStyle fill:#fae8ff,stroke:#d946ef,stroke-width:2px,color:#701a75;
    classDef bizStyle fill:#e0f2fe,stroke:#0ea5e9,stroke-width:2px,color:#0369a1;
    classDef pageStyle fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#047857;
    classDef infraStyle fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#be123c;

    subgraph testSuite["TESTS LAYER (tests/)"]
        direction LR
        api_specs["api/*.spec.ts<br/>(4 API specs)"]
        ui_specs["ui/*.spec.ts<br/>(7 UI specs)"]
        auth["auth.setup.ts"]
    end

    subgraph domain["CORE BUSINESS LOGIC (business/)"]
        direction LR
        api_logic["<b>API Domain</b><br/>object, assertions, factories"]
        journeys["<b>Journeys</b><br/>login, cart, checkout, product"]
    end

    subgraph pageLayer["PAGE OBJECTS (pages/)"]
        direction LR
        login_p["login.page.ts"]
        flow_p["<b>Flow</b><br/>inventory<br/>cart<br/>checkout<br/>detail"]
    end

    subgraph infrastructure["INFRASTRUCTURE (infrastructure/)"]
        direction TB
        fixtures["Fixtures<br/>api.fixture.ts, ui.fixture.ts"]
        client["restful.client.ts"]
        env["config/env.ts"]
    end

    api_specs --> fixtures
    fixtures --> api_logic
    fixtures --> client
    client --> env
    api_logic --> client
    ui_specs --> journeys
    journeys --> pageLayer
    ui_specs --> pageLayer
    auth --> login_p

    testSuite ~~~ infrastructure
    infrastructure ~~~ domain
    domain ~~~ pageLayer

    class auth,ui_specs,api_specs testStyle;
    class journeys,api_logic bizStyle;
    class login_p,flow_p pageStyle;
    class fixtures,client,env infraStyle;
```

## Design principles

- **Deep modules over shallow wrappers** — API client interface is 6 methods
  (CRUD only); assertions are composed separately
- **Thin POMs via composition, not inheritance** — pages stay standalone with a
  lightweight base
- **Fixture-managed resource lifecycles** — collection scopes per test,
  auto-generated via fixture
- **Deterministic data factories** — every test creates its own data; no shared
  state
- **Extracted auth** — login uses a page object and TTL-cached storage state

## Getting started

```bash
npm install
npx playwright install chromium firefox
npm run check
```

## Dev container

This repo includes a VS Code devcontainer that mirrors the Playwright Docker
image used in CI:

- Base image: `mcr.microsoft.com/playwright:v1.61.1-noble`
- Install step: `npm ci`
- Version guard: `npm run verify:playwright` checks devcontainer and CI
  Playwright Docker images against `package-lock.json`
- Browser stability flag: `--ipc=host`
- Playwright UI Mode port: `9323`

To use it:

1. Install the VS Code **Dev Containers** extension locally.
2. Open the command palette and run **Dev Containers: Reopen in Container**.
3. Make sure `.env.local` exists. UI tests still load
   `playwright.config.ts`, so `API_BASE_URL` must be present even when you only
   run SauceDemo UI tests.
4. Start Playwright UI Mode:

```bash
npm run test:ui:mode
```

The UI Mode server binds to `0.0.0.0:9323` so VS Code can forward it from the
container to your browser.

To run API tests, complete the [Supabase API setup](#supabase-api-setup) first,
then:

```bash
npm run test:api    # API only
npm test            # Full suite (UI + API)
```

## Supabase API setup

The API tests run against a Supabase PostgREST endpoint. Here's how to set it up:

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up.
2. Create a new project — choose any name (e.g. `awesome-pw-tests`), generate a
   database password, pick the closest region, and select the **Free** plan.
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

- `npm test` — Run the full suite (UI + API)
- `npm run test:ui` — Run SauceDemo across Chromium, Firefox, WebKit
- `npm run test:api` — Run API tests against the configured Supabase project
- `npm run test:headed` — Run SauceDemo Chromium in headed mode
- `npm run test:debug` — Debug SauceDemo Chromium
- `npm run test:ui:mode` — Open Playwright UI Mode on forwarded port `9323`
- `npm run report` — Open the HTML test report
- `npm run check` — Verify Playwright Docker image versions, lint, and typecheck

### Git hooks

Local hooks are managed by `simple-git-hooks` and installed by `npm install`
through the `prepare` script:

- `pre-commit` — runs `lint-staged`
- `pre-push` — runs `npm run typecheck`

`lint-staged` runs ESLint autofix and Prettier on staged TypeScript files, and
Prettier on staged JS, JSON, Markdown, and YAML files.

### CI

- `npm run test:ci` — Full suite via encrypted `.env.production`
- `npm run test:ui:ci` — UI tests (Chromium, Firefox, WebKit) via encrypted
  `.env.production`
- `npm run test:api:ci` — API tests via encrypted `.env.production`

## CI pipeline

The `.github/workflows/playwright.yml` workflow runs on every push to `main`
and pull request.

### Dependency and security automation

- `.github/dependabot.yml` keeps npm packages and GitHub Actions versions fresh
  with weekly Monday update checks.
- Dependabot groups Playwright/reporting packages, TypeScript/linting tooling,
  and GitHub Actions updates into focused PRs.
- `.github/workflows/snyk-security.yml` runs on pushes to `main`, pull requests,
  and a weekly Monday schedule.
- The Snyk workflow requires `SNYK_TOKEN` in repository secrets, uploads SARIF
  results to GitHub Security, and updates the dependency security matrix below
  on non-PR runs.

### Jobs

- `lint` — always runs `npm run check` (linter + typecheck)
- `api-tests` — depends on `lint`; always runs Playwright API project
  against Supabase PostgREST
- `ui-tests` — depends on `lint`; always runs the chromium / firefox /
  webkit matrix against saucedemo.com
- `ctrf-report` — depends on `api-tests` and `ui-tests`; always aggregates
  CTRF JSON into a PR comment via `ctrf-io/github-test-reporter`
- `allure-report` — depends on `api-tests` and `ui-tests`; runs on pushes to
  `main` to generate Allure HTML report + trend history
- `allure-deploy` — depends on `allure-report`; runs on pushes to `main` to
  deploy Allure report to GitHub Pages

### Test reporting

#### CTRF — PR summary

- Each test job sets `CTRF_REPORT_FILE: ctrf-<project|browser>.json`
- `playwright.config.ts` conditionally registers
  `playwright-ctrf-json-reporter` when the env var is set
- The reporter writes to `ctrf/<filename>` (default subdirectory)
- Uploaded as artifact `ctrf-*`
- `ctrf-report` job downloads all `ctrf-*` artifacts, merges, and runs
  `ctrf-io/github-test-reporter` with `suite-folded-report: true` +
  `group-by: suite`

#### Allure — GitHub Pages dashboard

- Allure report is deployed to GitHub Pages via `actions/deploy-pages@v5`
- Only runs on push to `main` (not on PRs)
- Accessible at `https://roman-pinchuk.github.io/awesome-pw-template/`

### Allure history caching

Cross-run trend data (history graphs, duration trends) is preserved via
`actions/cache`:

1. **Restore** — `actions/cache/restore@v6` loads the full
   `allure-history/` directory (previous run reports + trend data)
2. **Seed** — If `allure-history/last-history/` exists, trend data is copied
   into `allure-results/history/` before the report generator runs
3. **Generate** — `simple-elf/allure-report-action@v1.14` generates the HTML
   report. `keep_reports: 20` limits the number of historical runs
4. **Deploy** — `actions/upload-pages-artifact@v5` uploads `allure-history/`
   (all cached runs + the new one). `actions/deploy-pages@v5` publishes to
   GitHub Pages
5. **Save** — `actions/cache/save@v6` stores the updated `allure-history/` for
   the next run

Cache key: `allure-history-<branch>-<run_id>` — unique per run, no concurrent
save conflicts. Cache eviction: 7 days of inactivity.

### Action versions

- `actions/checkout` — `@v7`, latest as of 2026-07
- `actions/setup-node` — `@v6`, latest as of 2026-07
- `actions/upload-artifact` — `@v7`, latest as of 2026-07
- `actions/download-artifact` — `@v8`, latest as of 2026-07
- `actions/cache` — `@v6`, latest as of 2026-07
- `actions/cache/restore` — `@v6`, latest as of 2026-07
- `actions/cache/save` — `@v6`, latest as of 2026-07
- `actions/upload-pages-artifact` — `@v5`, latest as of 2026-07
- `actions/deploy-pages` — `@v5`, latest as of 2026-07
- `ctrf-io/github-test-reporter` — `@v1.1.0`, latest as of 2026-07
- `simple-elf/allure-report-action` — `@v1.14`, latest as of 2026-07

## Environment loading

- **Local** — `infrastructure/config/env.ts` loads `.env.local` via
  `@dotenvx/dotenvx` when `CI` is not set. `API_BASE_URL` and `API_KEY` are
  validated at startup.
- **CI** — the `test:*:ci` scripts use `dotenvx run -f .env.production` to
  decrypt and inject the encrypted `.env.production` file.
- `playwright.config.ts` and `infrastructure/config/env.ts` validate the
  injected environment before tests run.
- API requests read `API_BASE_URL` (Supabase project URL) and `API_KEY` (anon
  key) from the active env file.
