import { mkdir, writeFile } from 'node:fs/promises';

const [resultsDir = 'allure-results'] = process.argv.slice(2);
const {
  ALLURE_REPORT_BASE_URL,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_RUN_NUMBER,
  GITHUB_SERVER_URL,
} = process.env;

if (
  !ALLURE_REPORT_BASE_URL ||
  !GITHUB_REPOSITORY ||
  !GITHUB_RUN_ID ||
  !GITHUB_RUN_NUMBER ||
  !GITHUB_SERVER_URL
) {
  throw new Error('Allure executor metadata environment variables are incomplete.');
}

await mkdir(resultsDir, { recursive: true });
await writeFile(
  `${resultsDir}/executor.json`,
  `${JSON.stringify({
    name: 'GitHub Actions',
    type: 'github',
    reportName: 'Allure Report with history',
    reportUrl: `${ALLURE_REPORT_BASE_URL}/${GITHUB_RUN_NUMBER}`,
    buildName: `GitHub Actions Run #${GITHUB_RUN_ID}`,
    buildOrder: Number(GITHUB_RUN_NUMBER),
    buildUrl: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
  })}\n`,
);
