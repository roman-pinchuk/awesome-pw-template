import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const source = value('source', '.github/report-site');
const site = value('site', 'pages-artifact');
const history = value('history', 'allure-history');
const runNumber = value('run-number');
const maxReports = Number(value('max-reports', '20'));
const maxBytes = Number(value('max-bytes', String(500 * 1024 * 1024)));

if (!/^\d+$/.test(runNumber ?? '')) throw new Error('A numeric run number is required.');
if (!Number.isInteger(maxReports) || maxReports < 1)
  throw new Error('max-reports must be positive.');
if (!Number.isFinite(maxBytes) || maxBytes < 1) throw new Error('max-bytes must be positive.');

const copy = async (from, to) => {
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
};

const directorySize = async (directory) => {
  let total = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    total += entry.isDirectory() ? await directorySize(path) : (await stat(path)).size;
  }
  return total;
};

// Keep the complete published tree, not only the persistent cache, under the size budget.

await mkdir(history, { recursive: true });
await copy(join(source, 'allure'), join(history, runNumber));

const reports = (await readdir(history, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => Number(right) - Number(left));

for (const oldReport of reports.slice(maxReports))
  await rm(join(history, oldReport), { recursive: true });

const retained = reports.slice(0, maxReports);

await copy(source, site);
await copy(join(history, runNumber), join(site, 'allure'));
await mkdir(join(site, 'allure', 'history'), { recursive: true });
for (const report of retained) {
  if (report === runNumber) continue;
  await copy(join(history, report), join(site, 'allure', 'history', report));
}

await writeFile(
  join(site, 'report-metadata.json'),
  `${JSON.stringify(
    {
      runNumber,
      branch: value('branch', 'unknown'),
      commit: value('commit', 'unknown'),
      runUrl: value('run-url', '#'),
      generatedAt: value('generated-at', new Date().toISOString()),
    },
    null,
    2,
  )}\n`,
);

while ((await directorySize(site)) > maxBytes && retained.length > 1) {
  const oldest = retained.pop();
  await rm(join(history, oldest), { recursive: true });
  await rm(join(site, 'allure', 'history', oldest), { recursive: true });
}
if ((await directorySize(site)) > maxBytes) {
  throw new Error(`Report site exceeds ${maxBytes} bytes even with the newest Allure report.`);
}
