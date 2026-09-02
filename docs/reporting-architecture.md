# Reporting Architecture

## Result Flow

```text
Playwright projects
  +-> playwright-report/       browser report artifacts
  +-> ctrf/                    per-project JSON
  +-> allure-results/          Allure result files
                                      |
                                      v
                         allure-report job on main
                                      |
                         Allure 3 HTML + history
                                      |
                                      v
                              GitHub Pages
```

## CTRF

Each API or browser job writes a project-specific CTRF JSON artifact. The
`ctrf-report` job downloads and merges those artifacts, then publishes a PR
summary and an artifact containing processed insights. CTRF is the short-lived
CI feedback path for pull requests and workflow runs.

## Allure 3

The official `allure` CLI generates the report from the combined
`allure-results/` directory. `allurerc.mjs` configures the output directory,
categories, JSONL history path, and a 20-run history limit.

The report job also writes executor metadata with links to the workflow, branch,
commit, and published report. `scripts/publish-allure-report.mjs` copies the
generated report into a numbered directory, retains the newest 20 valid report
directories, and creates the root redirect to the latest report.

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

- [Latest Allure report](https://roman-pinchuk.github.io/awesome-pw-template/)
- [Playwright workflow](../.github/workflows/playwright.yml)
- [Allure configuration](../allurerc.mjs)
- [Report publisher](../scripts/publish-allure-report.mjs)
