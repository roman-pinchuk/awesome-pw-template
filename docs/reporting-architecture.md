# Reporting Architecture

## Result Flow

```text
                           ┌────────────────────┐
                           │ Playwright projects│
                           └─────────┬──────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
      ┌──────────────────────┐ ┌───────────────┐ ┌────────────────────┐
      │ blob-report/         │ │ ctrf/         │ │ allure-results/    │
      │ Playwright blobs     │ │ project JSON  │ │ Allure result files │
      └──────────┬───────────┘ └──────┬────────┘ └──────────┬─────────┘
                 └────────────────────┼─────────────────────┘
                                      ▼
                            ┌──────────────────┐
                            │ report-site job  │
                            │ merge + render   │
                            └─────────┬────────┘
                                      ▼
                            ┌────────────────────────────┐
                            │ Pages landing page         │
                            │ /playwright /allure /ctrf │
                            └────────────────────────────┘
```

## CTRF

Each API or browser job writes a project-specific CTRF JSON artifact. The
`ctrf-report` job downloads and merges those artifacts, then publishes a PR
summary. The main-branch `report-site` job also renders the merged data as
HTML under `/ctrf/`. Raw CTRF files are short-lived CI artifacts.

## Allure 3

The official `allure` CLI generates the report from the combined
`allure-results/` directory. `allurerc.mjs` configures the output directory,
categories, JSONL history path, and a 20-run history limit.

The report job also writes executor metadata with links to the workflow, branch,
commit, and published report. `scripts/publish-allure-report.mjs` copies the
generated report into a numbered directory, retains the newest 20 valid report
directories. The combined site exposes the latest report at `/allure/`.

The `report-site` job runs `allure generate` over the combined results. The
separate `allure-quality-gate` job runs `allure quality-gate` against the same
downloaded results and exposes its exit status as a dedicated CI check. It
requires a 100% success rate and at least 70 tests. A quality-gate failure makes
CI red but does not prevent the report from being generated or deployed;
deployment is blocked only when report generation fails.

## Pages Site and Retention

The report site is assembled once per main-branch run. Playwright blobs are
merged into one HTML report under `/playwright/`; CTRF is rendered under
`/ctrf/`; and the latest Allure report is published under `/allure/`. The
responsive landing page supports Auto, Light, and Dark themes and links to all
three reports.

Raw report artifacts use one-day retention and the Pages deployment artifact
also uses one-day retention. The published site keeps up to 20 Allure reports
under `/allure/history/`, with a 500 MiB size ceiling. Oldest reports are
removed until both limits are satisfied. Playwright and CTRF retain only the
latest run in Pages.

## History Cache Lifecycle

The workflow uses a branch-scoped GitHub Actions cache:

1. Restore the exact run key, then fall back to the newest cache for the branch.
2. Generate Allure using the restored `allure-history/history.jsonl`.
3. Publish the new numbered report and trim old report directories.
4. Save the complete `allure-history/` directory under the current run key.

The current cache is small. The latest observed two-run cache is about 2.25 MB,
so 20 runs are expected to remain well below GitHub's default repository cache
allowance. The cache is appropriate here because this project needs a bounded,
best-effort trend window rather than permanent test analytics.

## Cache Miss and Recovery

If the cache is missing, the workflow creates a new history directory and the
run succeeds. Allure history then starts over from that run. Existing published
Pages reports are not deleted immediately, but a future deployment built from
the empty cache will no longer include those old report directories.

The cache is automatically rebuilt on every successful report job. GitHub may
evict unused cache entries after seven days or remove older entries when the
repository reaches its cache storage limit. There is currently no automatic
reconstruction of the full old history after a total cache miss.

## Durability Tradeoff

GitHub Pages is the durable location for the report directories that are
currently deployed. The cache is only the source used to carry the rolling
history into the next build. This keeps the solution free and simple, but cache
eviction can reset trends.

If permanent history or long-term analytics becomes a requirement, use Allure
Report Storage or another persistent object store. That would require changing
the workflow and introducing additional service configuration; it is not needed
for the current 20-run test-template use case.

## Operational Links

- [Report landing page](https://roman-pinchuk.github.io/awesome-pw-template/)
- [Latest Allure report](https://roman-pinchuk.github.io/awesome-pw-template/allure/)
- [Playwright workflow](../.github/workflows/playwright.yml)
- [Allure configuration](../allurerc.mjs)
- [Report publisher](../scripts/publish-allure-report.mjs)
