# Project Memory

This file is the index for durable project knowledge. Detailed architecture
notes remain in `docs/` and link to the implementation evidence they describe.

## Indexed Documents

- [Architecture overview](docs/architecture.md) — system purpose, dependency
  direction, UI/API/CI flows, external integrations, and key design decisions.
- [Testing architecture](docs/testing-architecture.md) — SauceDemo UI journeys,
  PostgREST REST Objects, fixtures, isolation, and configuration boundaries.
- [Reporting architecture](docs/reporting-architecture.md) — CTRF and Allure
  result flows, GitHub Pages deployment, history caching, and recovery tradeoffs.
- [Project context](CONTEXT.md) — agent-facing domain vocabulary and concise
  implementation conventions for this repository.

## Current Orientation

This repository is a Playwright + TypeScript automation template for SauceDemo
UI testing and Supabase PostgREST API testing. Tests express behavior at the
boundary; reusable domain behavior belongs in `business/`, browser mechanics in
`pages/`, and transport/configuration/fixtures/reporting concerns in
`infrastructure/`. See the [architecture overview](docs/architecture.md) for
the authoritative dependency direction and runtime flows.

## Maintenance Notes

- Update the linked architecture documents when durable boundaries, workflows,
  integrations, or reporting behavior change.
- No unresolved architecture contradictions were identified during
  initialization.
