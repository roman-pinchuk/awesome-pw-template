import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Allure Report with history',
  output: process.env.ALLURE_OUTPUT ?? './allure-report',
  historyPath: process.env.ALLURE_HISTORY_PATH ?? './allure-history/history.jsonl',
  historyLimit: 20,
  plugins: {
    awesome: {
      options: {
        groupBy: ['project', 'parentSuite', 'suite', 'subSuite'],
      },
    },
  },
  environments: {
    chromium: {
      name: 'Chromium',
      matcher: ({ labels }) =>
        labels.some(({ name, value }) => name === 'project' && value === 'chromium'),
    },
    firefox: {
      name: 'Firefox',
      matcher: ({ labels }) =>
        labels.some(({ name, value }) => name === 'project' && value === 'firefox'),
    },
    webkit: {
      name: 'WebKit',
      matcher: ({ labels }) =>
        labels.some(({ name, value }) => name === 'project' && value === 'webkit'),
    },
    api: {
      name: 'API',
      matcher: ({ labels }) =>
        labels.some(({ name, value }) => name === 'project' && value === 'api'),
    },
    setup: {
      name: 'Setup',
      matcher: ({ labels }) =>
        labels.some(({ name, value }) => name === 'project' && value === 'setup'),
    },
  },
  qualityGate: {
    rules: [
      {
        successRate: 1,
        minTestsCount: 70,
        fastFail: true,
      },
    ],
  },
  categories: {
    rules: [
      {
        id: 'timeouts',
        name: 'Timeouts',
        matchers: {
          statuses: ['failed', 'broken'],
          message: /.*Timeout.*|.*timed out.*/,
          trace: /.*Timeout.*|.*timed out.*/,
        },
      },
      {
        id: 'ui-locator-issues',
        name: 'UI locator issues',
        matchers: {
          statuses: ['failed', 'broken'],
          message: /.*locator.*|.*strict mode violation.*|.*not visible.*|.*not attached.*/,
        },
      },
      {
        id: 'api-response-issues',
        name: 'API response issues',
        matchers: {
          statuses: ['failed', 'broken'],
          message: /.*status.*|.*response.*|.*JSON.*|.*schema.*|.*API.*/,
        },
      },
      {
        id: 'skipped-tests',
        name: 'Skipped tests',
        matchers: { statuses: ['skipped'] },
      },
      {
        id: 'product-defects',
        name: 'Product defects',
        matchers: { statuses: ['failed'] },
      },
      {
        id: 'test-defects',
        name: 'Test defects',
        matchers: { statuses: ['broken'] },
      },
    ],
  },
});
