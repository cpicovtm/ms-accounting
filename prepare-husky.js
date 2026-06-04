const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const huskyDir = path.join(__dirname, '.husky');
const preCommitFile = path.join(huskyDir, 'pre-commit');

function safeExec(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: 'ignore', ...opts });
    return true;
  } catch {
    return false;
  }
}

const hasGit = safeExec('git --version');
const hasNpx = safeExec('npx --version');

if (hasGit && hasNpx) {
  try {
    execSync('npx husky', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to run husky install:', error.message || error);
  }
} else {
  if (!hasNpx) console.info('npx not found: skipping husky install');
  if (!hasGit) console.info('git not found: skipping husky install');
}

try {
  fs.mkdirSync(huskyDir, { recursive: true });
} catch {
  // ignore
}

try {
  fs.writeFileSync(preCommitFile, 'npx lint-staged', { encoding: 'utf8' });
} catch (err) {
  console.error('Failed to write pre-commit hook:', err.message || err);
}

if (process.platform !== 'win32') {
  try {
    safeExec('chmod +x "' + preCommitFile + '"');
  } catch (error) {
    console.error('Failed to make pre-commit executable:', error.message || error);
  }
}
