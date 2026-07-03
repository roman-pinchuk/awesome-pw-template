# Project Context

This repository is a Playwright + TypeScript automation template for UI and API testing. Use these domain terms when discussing seams, modules, tests, and architecture.

## Domain Glossary

### SauceDemo

The UI test target at `https://www.saucedemo.com`. SauceDemo contains login, inventory, cart, and checkout flows used by the UI test suite.

### Product Catalog

The set of visible products on the SauceDemo inventory page. Product catalog behavior includes product names, product count, and sort order by name or price.

### Cart Journey

The user path that starts from inventory, adds one or more products, opens the cart, and verifies cart contents. Repeated cart setup belongs behind the Cart journey module rather than in individual tests.

### Checkout Journey

The user path that starts from a populated cart, enters customer information, reviews the checkout overview, and completes the order. Checkout tests should express checkout intent instead of low-level navigation mechanics.

### REST Object

The API domain record stored in the Supabase PostgREST `objects` table. A REST object has an id, name, data, and optional collection metadata.

### REST Object Collection

A per-test collection scope used to isolate API records. Collection names are generated for tests so list/query behavior does not depend on shared state.

### REST Object Lifecycle

The creation, tracking, and cleanup of REST objects during a test. Lifecycle ownership belongs in the API fixture module through `apiObjects`, not in test-level `try/finally` cleanup.

### REST Adapter

The PostgREST transport module that sends CRUD requests and returns raw Playwright `APIResponse` objects. The REST adapter should not own REST object domain shape.

### API Assertion Module

The response verification module for REST object responses. It composes with the REST adapter in tests while keeping assertions out of the transport module.

## Architecture Notes

- Keep domain shape in `business/`; keep transport details in `infrastructure/`.
- Keep route knowledge centralised in `ROUTES` and page navigation through `BasePage.goto`.
- Use fixture modules for cross-cutting test concerns such as labels, logging, and resource lifecycle.
- Prefer tests that assert user-visible domain behavior, such as Product Catalog order, over tests that only assert control state.
