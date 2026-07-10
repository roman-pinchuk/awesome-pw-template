import type { Category } from 'allure-js-commons/sdk';
import { Status } from 'allure-js-commons';

export const allureCategories = [
  {
    name: 'Timeouts',
    matchedStatuses: [Status.FAILED, Status.BROKEN],
    messageRegex: '.*Timeout.*|.*timed out.*',
    traceRegex: '.*Timeout.*|.*timed out.*',
  },
  {
    name: 'UI locator issues',
    matchedStatuses: [Status.FAILED, Status.BROKEN],
    messageRegex: '.*locator.*|.*strict mode violation.*|.*not visible.*|.*not attached.*',
  },
  {
    name: 'API response issues',
    matchedStatuses: [Status.FAILED, Status.BROKEN],
    messageRegex: '.*status.*|.*response.*|.*JSON.*|.*schema.*|.*API.*',
  },
  {
    name: 'Skipped tests',
    matchedStatuses: [Status.SKIPPED],
  },
  {
    name: 'Product defects',
    matchedStatuses: [Status.FAILED],
  },
  {
    name: 'Test defects',
    matchedStatuses: [Status.BROKEN],
  },
] satisfies Category[];
