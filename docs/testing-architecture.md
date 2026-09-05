# Testing Architecture

## UI Testing

UI tests target SauceDemo and are grouped by user intent:

- `tests/ui/login-validation.spec.ts` covers login validation behavior.
- `tests/ui/inventory-filters.spec.ts` covers Product Catalog sorting.
- `tests/ui/cart-journey.spec.ts` and `cart-remove.spec.ts` cover Cart Journey
  behavior.
- `tests/ui/checkout-flow.spec.ts` covers Checkout Journey behavior.
- `tests/ui/product-detail.spec.ts` covers product detail behavior.
- `tests/ui/smoke.spec.ts` covers the main application path.

### Page Objects

`pages/` contains thin objects for browser mechanics: locators, page state, and
small interaction primitives. `BasePage` centralizes navigation and shared
page behavior. Header behavior is a component because it is reused across
pages.

Page objects should not contain complete business scenarios. A multi-page flow
belongs in a journey module.

### Journeys

`business/*.journey.ts` expresses reusable user behavior:

- `login.journey.ts` handles authenticated entry.
- `product.journey.ts` handles Product Catalog behavior.
- `cart.journey.ts` handles Cart Journey setup and verification.
- `checkout.journey.ts` handles Checkout Journey behavior.

Tests should call these operations and assert domain outcomes rather than
repeating navigation and locator mechanics.

## API Testing

API tests target Supabase PostgREST and model records as REST Objects.

```text
┌──────┐   ┌─────────────┐   ┌──────────────────┐   ┌───────────────┐   ┌───────────┐
│ test │──▶│ api.fixture │──▶│ business factory │──▶│ REST adapter  │──▶│ PostgREST │
└──────┘   └─────────────┘   └─────────┬────────┘   └───────────────┘   └───────────┘
                                       │
                                       ▼
                              ┌──────────────────────┐
                              │ API assertion module │
                              └──────────────────────┘
```

- `business/api/object.ts` defines the REST Object domain shape.
- `business/api/factories/` creates valid request data.
- `business/api/assertions/` verifies response contracts and behavior.
- `infrastructure/clients/restful.client.ts` owns CRUD transport only.
- `tests/api/objects/` covers schema, CRUD, query, patch, and auth behavior.

The REST adapter must not own domain assertions or test cleanup.

## Fixtures and Isolation

Fixtures provide cross-cutting concerns without hiding scenario intent:

- `ui.fixture.ts` supplies UI setup and shared labels.
- `api.fixture.ts` supplies API setup and `apiObjects` lifecycle ownership.
- `auth.setup.ts` creates the reusable authenticated browser state.

Each API test receives a generated collection scope. Created REST Objects are
tracked by the fixture and cleaned up there, so tests do not need repetitive
`try/finally` blocks or shared records.

## Configuration Boundaries

- `playwright.config.ts` defines projects, reporters, retries, and test
  execution settings.
- `infrastructure/config/env.ts` validates environment variables at startup.
- `business/constants.ts` is the single source of route knowledge.
- `infrastructure/utils/` contains logging and Allure label helpers.

Environment values are loaded differently for local and CI execution; tests
should consume the validated configuration rather than read process variables
directly. Run tests inside the devcontainer so the execution environment
matches CI.
