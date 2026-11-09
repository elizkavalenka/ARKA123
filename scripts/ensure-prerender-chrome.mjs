
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const version = '131.0.6778.204';

const cacheDir =
  process.env.PUPPETEER_CACHE_DIR ||
  path.join(os.homedir(), '.cache', 'puppeteer');

const isWindows = process.platform === 'win32';

const platformFolder = isWindows
  ? `win64-${version}`
  : `linux-${version}`;

const executableRelative = isWindows
  ? 'chrome-win64/chrome.exe'
  : 'chrome-linux64/chrome';

const installDir = path.join(
  cacheDir,
  'chrome',
  platformFolder
);

const executable = path.join(
  installDir,
  executableRelative
);

if (!fs.existsSync(executable)) {
  console.log('Incomplete Chrome installation detected.');
  console.log('Removing:', installDir);

  fs.rmSync(installDir, {
    recursive: true,
    force: true
  });
} else {
  console.log('Chrome executable already exists:', executable);
}
