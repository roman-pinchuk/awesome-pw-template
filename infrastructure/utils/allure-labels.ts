import * as allure from 'allure-js-commons/sync';
import type { TestInfo } from '@playwright/test';

export function setLabels(testInfo: TestInfo, epic: string) {
  allure.epic(epic);
  for (const ann of testInfo.annotations) {
    if (ann.type === 'feature') allure.feature(ann.description!);
  }
  for (const tag of testInfo.tags) {
    allure.tag(tag.replace(/^@/, ''));
  }
}
