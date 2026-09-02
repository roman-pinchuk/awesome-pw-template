import * as allure from 'allure-js-commons/sync';
import type { TestInfo } from '@playwright/test';

/**
 * Maps Playwright metadata to Allure labels for report navigation.
 *
 * @remarks
 * Feature annotations and `@tag` values stay in the specs; this utility owns
 * the reporting integration so test bodies remain focused on behavior.
 */
export const setLabels = (testInfo: TestInfo, epic: string): void => {
  allure.epic(epic);
  allure.label('project', testInfo.project.name);
  for (const ann of testInfo.annotations) {
    if (ann.type === 'feature') allure.feature(ann.description!);
  }
  for (const tag of testInfo.tags) {
    const value = tag.replace(/^@/, '');
    if (/^CASE-/i.test(value)) allure.testCaseId(value);
  }
};
