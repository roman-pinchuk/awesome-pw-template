# Architecture

## Purpose

This repository is a Playwright + TypeScript automation template. It separates
test intent, business behavior, browser/API transport, and cross-cutting test
infrastructure so that tests describe behavior rather than implementation
mechanics.

## System Overview

```text
tests/
  UI and API specifications
        |
        v
business/
  journeys, domain records, factories, assertions
        |                         |
        v                         v
pages/                      infrastructure/
  page objects               fixtures, clients, config, utilities
        |                         |
        +------------+------------+
                     v
              Playwright runner
                     |
                     v
        CI artifacts, CTRF, Allure
```

## Dependency Direction

- `tests/` owns scenarios and assertions at the test boundary.
- `business/` owns domain language and reusable user/API behavior.
- `pages/` owns browser interaction details for SauceDemo.
- `infrastructure/` owns transport, configuration, fixtures, logging, and
  reporting labels.
- `playwright.config.ts` composes projects, reporters, retries, and shared test
  settings.

Lower-level modules must not pull test scenarios from `tests/`. Transport
modules return transport responses; domain assertions stay in the business
layer.

## Runtime Flows

### UI Flow

UI specifications use fixtures and business journeys. Journeys coordinate page
objects such as login, inventory, cart, and checkout pages. Page objects use
centralized routes and expose user-facing operations to tests.

### API Flow

API specifications use the API fixture and REST Object domain modules. The REST
adapter sends PostgREST requests and returns raw `APIResponse` values. Domain
factories create isolated records, while the API assertion module verifies
responses. The `apiObjects` fixture owns object cleanup.

### CI Flow

The GitHub Actions workflow runs linting, API tests, and the browser matrix.
Test jobs upload Playwright, CTRF, and Allure artifacts. Aggregation and Pages
deployment happen only for pushes to `main`.

## Focused Documentation

- [Testing architecture](testing-architecture.md) explains UI, API, fixtures,
  test isolation, and module responsibilities.
- [Reporting architecture](reporting-architecture.md) explains CTRF, Allure 3,
  GitHub Pages, history caching, retention, and recovery behavior.

## Key Decisions

- Prefer deep domain modules over repeated test-level setup.
- Keep page objects thin and compose them through journeys.
- Generate test data per test and scope REST Objects to per-test collections.
- Keep route knowledge centralized and navigate through `BasePage.goto`.
- Keep reporting orchestration in CI rather than in transport or assertion
  modules.
