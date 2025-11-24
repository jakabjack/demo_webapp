#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { cwd } from 'process';

/**
 * Script to check test coverage for files changed since a given git reference
 * Usage: node scripts/check-coverage-changed.js [git-ref]
 * Example: node scripts/check-coverage-changed.js HEAD~1
 */

const gitRef = process.argv[2] || 'HEAD~1';
const coverageThreshold = 80;

try {
  // Get list of changed files
  const changedFiles = execSync(`git diff ${gitRef} --name-only --diff-filter=ACM`, { encoding: 'utf-8' })
    .split('\n')
    .filter(file => file.match(/^src\/.*\.(ts|tsx)$/) && !file.match(/\.test\.|\.spec\./))
    .filter(Boolean);

  if (changedFiles.length === 0) {
    console.log('✓ No source files changed');
    process.exit(0);
  }

  console.log(`\nChecking coverage for ${changedFiles.length} changed file(s):\n`);
  changedFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');

  // Run tests with coverage
  console.log('Running tests with coverage...\n');
  try {
    execSync('npm run test:coverage', { stdio: 'pipe' });
  } catch (error) {
    // Tests might fail, but we still want to check coverage
    // Only throw if coverage report wasn't generated
  }

  // Read coverage report
  const coverageSummary = JSON.parse(
    readFileSync('./coverage/coverage-summary.json', 'utf-8')
  );

  let failedFiles = [];

  // Check coverage for each changed file
  changedFiles.forEach(file => {
    const filePath = cwd() + '/' + file;
    const fileCoverage = coverageSummary[filePath];

    if (!fileCoverage) {
      console.log(`✗ ${file}: No coverage data found (file not covered by tests)`);
      failedFiles.push({ file, reason: 'No tests found' });
      return;
    }

    const metrics = {
      statements: fileCoverage.statements.pct,
      branches: fileCoverage.branches.pct,
      functions: fileCoverage.functions.pct,
      lines: fileCoverage.lines.pct,
    };

    const failed = Object.entries(metrics).filter(([_, pct]) => pct < coverageThreshold);

    if (failed.length > 0) {
      console.log(`✗ ${file}:`);
      Object.entries(metrics).forEach(([metric, pct]) => {
        const status = pct >= coverageThreshold ? '✓' : '✗';
        console.log(`    ${status} ${metric}: ${pct.toFixed(2)}%`);
      });
      failedFiles.push({ file, metrics });
    } else {
      console.log(`✓ ${file}: All metrics >= ${coverageThreshold}%`);
    }
  });

  console.log('');

  if (failedFiles.length > 0) {
    console.error(`\n❌ Coverage check failed for ${failedFiles.length} file(s)`);
    console.error(`   Required threshold: ${coverageThreshold}%\n`);
    process.exit(1);
  }

  console.log(`✅ All changed files meet the coverage threshold of ${coverageThreshold}%\n`);
  process.exit(0);

} catch (error) {
  console.error('Error running coverage check:', error.message);
  process.exit(1);
}
