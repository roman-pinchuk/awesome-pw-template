import { readFileSync } from 'node:fs';

const packageLockPath = 'package-lock.json';
const devcontainerPath = '.devcontainer/devcontainer.json';
const workflowPath = '.github/workflows/playwright.yml';
const imagePrefix = 'mcr.microsoft.com/playwright:v';
const imageSuffix = '-noble';

const colorEnabled =
  process.env.NO_COLOR === undefined &&
  (process.env.FORCE_COLOR === '1' || process.env.FORCE_COLOR === 'true' || process.stdout.isTTY);

const color = {
  bold: (value) => (colorEnabled ? `\x1b[1m${value}\x1b[0m` : value),
  cyan: (value) => (colorEnabled ? `\x1b[36m${value}\x1b[0m` : value),
  green: (value) => (colorEnabled ? `\x1b[32m${value}\x1b[0m` : value),
  red: (value) => (colorEnabled ? `\x1b[31m${value}\x1b[0m` : value),
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function getLockedPlaywrightVersion(packageLock) {
  const version = packageLock.packages?.['node_modules/@playwright/test']?.version;

  if (typeof version !== 'string' || version.length === 0) {
    throw new Error(`${packageLockPath} is missing node_modules/@playwright/test version`);
  }

  return version;
}

function getWorkflowPlaywrightImage(workflowYaml) {
  const match = workflowYaml.match(/^\s*PLAYWRIGHT_IMAGE:\s*(?:&\S+\s+)?([^\s#]+).*$/m);
  return match?.[1];
}

function parsePlaywrightImageVersion(image) {
  if (typeof image !== 'string') {
    return undefined;
  }

  const match = image.match(/^mcr\.microsoft\.com\/playwright:v(?<version>[^\s:]+?)(?:-[a-z0-9]+)?$/i);
  return match?.groups?.version;
}

function highlightVersion(value, version, highlight) {
  if (typeof value !== 'string' || typeof version !== 'string') {
    return color.red('missing');
  }

  return value.replace(`v${version}`, `v${highlight(version)}`);
}

function formatImage(image, expectedVersion) {
  const version = parsePlaywrightImageVersion(image);
  const highlight = version === expectedVersion ? color.green : color.red;

  return highlightVersion(image, version, highlight);
}

export function collectPlaywrightImageVersionChecks({ packageLock, devcontainerJson, workflowYaml }) {
  const lockedVersion = getLockedPlaywrightVersion(packageLock);
  const expectedImage = `${imagePrefix}${lockedVersion}${imageSuffix}`;
  const checks = [
    {
      label: `${devcontainerPath} image`,
      image: devcontainerJson.image,
    },
    {
      label: `${workflowPath} PLAYWRIGHT_IMAGE`,
      image: getWorkflowPlaywrightImage(workflowYaml),
    },
  ].map((check) => ({
    ...check,
    version: parsePlaywrightImageVersion(check.image),
    expectedImage,
    expectedVersion: lockedVersion,
    ok: check.image === expectedImage,
  }));

  return {
    lockedVersion,
    expectedImage,
    checks,
  };
}

export function collectPlaywrightVersionMismatches(input) {
  const { checks } = collectPlaywrightImageVersionChecks(input);

  return checks
    .filter((check) => !check.ok)
    .map((check) => `${check.label} must be ${check.expectedImage}, found ${check.image ?? 'missing'}`);
}

function printPlaywrightImageVersionChecks(result) {
  console.log(color.bold('Playwright Docker image version mapping:'));
  console.log(`  ${packageLockPath}: ${color.cyan(result.lockedVersion)}`);

  for (const check of result.checks) {
    console.log(`  ${check.label}: ${formatImage(check.image, result.lockedVersion)}`);
  }

  console.log(
    `  expected Docker image: ${highlightVersion(result.expectedImage, result.lockedVersion, color.cyan)}`,
  );
}

export function verifyPlaywrightVersion() {
  const input = {
    packageLock: readJson(packageLockPath),
    devcontainerJson: readJson(devcontainerPath),
    workflowYaml: readFileSync(workflowPath, 'utf8'),
  };
  const result = collectPlaywrightImageVersionChecks(input);
  const mismatches = collectPlaywrightVersionMismatches(input);

  printPlaywrightImageVersionChecks(result);

  if (mismatches.length > 0) {
    throw new Error(`Playwright Docker image version mapping failed:\n${mismatches.map((m) => `  - ${m}`).join('\n')}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyPlaywrightVersion();
  console.log('');
  console.log('Playwright Docker image versions match package-lock.json');
}
