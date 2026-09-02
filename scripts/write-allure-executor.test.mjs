import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);

test('writes valid GitHub Actions executor metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'allure-executor-'));
  try {
    await execFileAsync(process.execPath, ['scripts/write-allure-executor.mjs', root], {
      env: {
        ...process.env,
        ALLURE_REPORT_BASE_URL: 'https://reports.example.test',
        GITHUB_REPOSITORY: 'owner/repository',
        GITHUB_RUN_ID: '12345',
        GITHUB_RUN_NUMBER: '21',
        GITHUB_SERVER_URL: 'https://github.com',
      },
    });

    assert.deepEqual(JSON.parse(await readFile(join(root, 'executor.json'))), {
      name: 'GitHub Actions',
      type: 'github',
      reportName: 'Allure Report with history',
      reportUrl: 'https://reports.example.test/21',
      buildName: 'GitHub Actions Run #12345',
      buildOrder: 21,
      buildUrl: 'https://github.com/owner/repository/actions/runs/12345',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
