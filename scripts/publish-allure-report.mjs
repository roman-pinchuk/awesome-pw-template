import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [reportDir = 'allure-report', historyRoot = 'allure-history', runNumber] =
  process.argv.slice(2);
const baseUrl =
  process.env.ALLURE_REPORT_BASE_URL ?? 'https://roman-pinchuk.github.io/awesome-pw-template';
const reportPath = join(historyRoot, runNumber);
const keepReports = 20;

if (!/^\d+$/.test(runNumber ?? '')) {
  throw new Error('A numeric GitHub Actions run number is required.');
}

await mkdir(historyRoot, { recursive: true });
await rm(reportPath, { recursive: true, force: true });
await cp(reportDir, reportPath, { recursive: true });

const reports = [];
for (const entry of await readdir(historyRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || !/^\d+$/.test(entry.name)) continue;
  try {
    await stat(join(historyRoot, entry.name, 'index.html'));
    reports.push(entry.name);
  } catch {
    await rm(join(historyRoot, entry.name), { recursive: true, force: true });
  }
}

await Promise.all(
  reports
    .sort((left, right) => Number(right) - Number(left))
    .slice(keepReports)
    .map((oldReport) => rm(join(historyRoot, oldReport), { recursive: true, force: true })),
);

await writeFile(
  join(historyRoot, 'index.html'),
  `<!DOCTYPE html><meta charset="utf-8"><meta http-equiv="refresh" content="0; URL=${baseUrl}/${runNumber}/index.html">\n`,
);
