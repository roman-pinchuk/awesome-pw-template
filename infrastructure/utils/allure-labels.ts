import * as allure from 'allure-js-commons/sync';
import type { TestInfo } from '@playwright/test';

export function mapLabels(testInfo: TestInfo) {
  for (const ann of testInfo.annotations) {
    if (ann.type === 'feature') allure.feature(ann.description!);
  }
  for (const tag of testInfo.tags) {
    allure.tag(tag.replace(/^@/, ''));
  }
}
