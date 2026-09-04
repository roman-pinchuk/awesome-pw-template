import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);

test('builds the Pages site and prunes old Allure reports by count and size', async () => {
  const root = await mkdtemp(join(tmpdir(), 'report-site-'));
  try {
    const source = join(root, 'source');
    const site = join(root, 'site');
    const history = join(root, 'history');
    await mkdir(join(source, 'playwright'), { recursive: true });
    await mkdir(join(source, 'allure'), { recursive: true });
    await writeFile(join(source, 'index.html'), '<a>Playwright HTML</a>');
    await writeFile(join(source, 'playwright', 'index.html'), 'playwright');
    await writeFile(join(source, 'allure', 'index.html'), 'allure');
    for (const number of ['1', '2', '3']) {
      await mkdir(join(history, number), { recursive: true });
      await writeFile(join(history, number, 'index.html'), number.repeat(2000));
    }

    await execFileAsync(process.execPath, [
      'scripts/build-report-site.mjs',
      '--source',
      source,
      '--site',
      site,
      '--history',
      history,
      '--run-number',
      '4',
      '--base-url',
      'https://reports.example.test',
      '--branch',
      'main',
      '--commit',
      'abc1234',
      '--run-url',
      'https://github.com/owner/repo/actions/runs/42',
      '--generated-at',
      '2026-09-04T12:00:00.000Z',
      '--max-reports',
      '2',
      '--max-bytes',
      '1500',
    ]);

    assert.equal(await readFile(join(site, 'playwright', 'index.html'), 'utf8'), 'playwright');
    assert.match(await readFile(join(site, 'index.html'), 'utf8'), /Playwright HTML/);
    assert.match(
      await readFile(join(site, 'allure', 'index.html'), 'utf8'),
      /allure\/history\/4\/index\.html/,
    );
    assert.deepEqual(
      (await readdir(history, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort(),
      ['4'],
    );
    assert.equal(
      await stat(join(site, 'allure', 'history', '4', 'index.html')).then((result) =>
        result.isFile(),
      ),
      true,
    );
    assert.equal(
      await stat(join(history, '4', 'index.html')).then((result) => result.isFile()),
      true,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
