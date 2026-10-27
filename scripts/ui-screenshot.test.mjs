import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import test from 'node:test';

const execFileAsync = promisify(execFile);

test('UI teardown captures once per attempt and tolerates unavailable screenshots', async () => {
  const parent = resolve('test-results');
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(join(parent, 'ui-screenshot-'));
  try {
    await writeFile(
      join(root, 'playwright.config.ts'),
      `export default {
        testDir: '.',
        tsconfig: ${JSON.stringify(resolve('tsconfig.json'))},
        outputDir: ${JSON.stringify(join(root, 'output'))},
        reporter: [['json', { outputFile: ${JSON.stringify(join(root, 'results.json'))} }]],
        workers: 1,
        timeout: 100,
        retries: 1,
      };`,
    );
    await writeFile(
      join(root, 'capture.spec.ts'),
      `import { setTimeout as delay } from 'node:timers/promises';
      import { test as uiTest, expect } from '../../infrastructure/fixtures/ui.fixture';
      const test = uiTest.extend({
        browser: [async ({}, use) => {
          await use({ version: () => 'fixture-test' });
        }, { scope: 'worker' }],
        page: async ({}, use, testInfo) => {
          const calls = [];
          await use({
            on: () => {},
            isClosed: () => testInfo.title === 'closed page',
            screenshot: async (options) => {
              calls.push({ options, status: testInfo.status });
              if (testInfo.title === 'capture error') throw new Error('capture unavailable');
              if (testInfo.title === 'independent capture budget') await delay(300);
              return Buffer.from('shared-screenshot');
            },
          });
          await testInfo.attach('capture-calls', {
            body: JSON.stringify(calls), contentType: 'application/json',
          });
        },
      });
      test('passed test', async () => {});
      test('failed test', async () => { expect('actual').toBe('expected'); });
      test('retry test', async ({}, testInfo) => { expect(testInfo.retry).toBe(1); });
      test('closed page', async () => {});
      test('capture error', async () => {});
      test('independent capture budget', async () => {});
      test.skip('skipped test', async () => {});
      `,
    );
    let stdout;
    try {
      await execFileAsync(
        process.execPath,
        [
          'node_modules/@playwright/test/cli.js',
          'test',
          '--config',
          join(root, 'playwright.config.ts'),
        ],
        {
          env: { ...process.env, CI: 'true', API_BASE_URL: 'https://example.test' },
        },
      );
      assert.fail('The deliberately failing test must make the nested run fail');
    } catch (error) {
      assert.equal(error.code, 1, error.stderr);
      stdout = error.stdout;
    }
    const report = JSON.parse(await readFile(join(root, 'results.json'), 'utf8'));
    assert.deepEqual(report.errors, [], stdout);
    const specs = report.suites.flatMap((suite) => suite.specs);
    assert.equal(specs.length, 7);
    const budgetResults = specs.find((spec) => spec.title === 'independent capture budget').tests[0]
      .results;
    assert.deepEqual(
      budgetResults.map((result) => result.status),
      ['passed'],
    );
    for (const spec of specs) {
      for (const result of spec.tests[0].results) {
        const screenshots = result.attachments.filter((item) => item.name === 'final-state');
        if (spec.title === 'skipped test') {
          assert.equal(screenshots.length, 0);
          continue;
        }
        const callsAttachment = result.attachments.find((item) => item.name === 'capture-calls');
        const calls = JSON.parse(Buffer.from(callsAttachment.body, 'base64').toString());
        if (spec.title === 'closed page') {
          assert.deepEqual(calls, []);
          assert.equal(screenshots.length, 0);
        } else {
          assert.deepEqual(calls, [
            {
              options: { type: 'webp', quality: 75, fullPage: false, timeout: 5000 },
              status: result.status,
            },
          ]);
          if (spec.title === 'capture error') {
            assert.equal(screenshots.length, 0);
            assert.equal(result.status, 'passed');
          } else {
            assert.equal(screenshots.length, 1);
            assert.equal(screenshots[0].contentType, 'image/webp');
            assert.equal(
              Buffer.from(screenshots[0].body, 'base64').toString(),
              'shared-screenshot',
            );
          }
        }
      }
    }
    assert.equal(specs.find((spec) => spec.title === 'failed test').tests[0].results.length, 2);
    assert.equal(specs.find((spec) => spec.title === 'retry test').tests[0].results.length, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
