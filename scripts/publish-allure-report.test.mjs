import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);

test('publishes the newest report and retains only the latest reports', async () => {
  const root = await mkdtemp(join(tmpdir(), 'allure-publish-'));
  try {
    const report = join(root, 'report');
    const history = join(root, 'history');
    await mkdir(report, { recursive: true });
    await mkdir(history, { recursive: true });
    await writeFile(join(report, 'index.html'), 'new report');
    for (const number of Array.from({ length: 20 }, (_, index) => String(index + 1))) {
      await mkdir(join(history, number), { recursive: true });
      await writeFile(join(history, number, 'index.html'), number);
    }

    await execFileAsync(
      process.execPath,
      ['scripts/publish-allure-report.mjs', report, history, '21'],
      {
        env: { ...process.env, ALLURE_REPORT_BASE_URL: 'https://reports.example.test' },
      },
    );

    const reports = (await readdir(history, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => Number(left) - Number(right));
    assert.deepEqual(
      reports,
      Array.from({ length: 20 }, (_, index) => String(index + 2)),
    );
    assert.match(
      await readFile(join(history, 'index.html'), 'utf8'),
      /reports\.example\.test\/21\/index\.html/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
