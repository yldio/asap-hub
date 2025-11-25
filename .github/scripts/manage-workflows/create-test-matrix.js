// import execSync
const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

// Packages that should be sharded (with their shard count)
const SHARDED_PACKAGES = {
  '@asap-hub/crn-frontend': 8, // Split into 8 shards (128 test files, ~16 per shard)
  '@asap-hub/react-components': 6, // Split into 6 shards (385 test files)
};

/**
 * Count test files in a package directory
 */
function countTestFiles(packageDir) {
  try {
    const srcDir = join(packageDir, 'src');
    let count = 0;

    function walkDir(dir) {
      const files = readdirSync(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
          count++;
        }
      }
    }

    if (require('fs').existsSync(srcDir)) {
      walkDir(srcDir);
    }
    return count;
  } catch {
    return 0;
  }
}

/**
 * Get package directory path
 */
function getPackageDir(packageName) {
  // Convert @asap-hub/crn-frontend to apps/crn-frontend
  const packagePath = packageName.replace('@asap-hub/', '');
  return join(__dirname, '../../..', packagePath);
}

// run turborepo dry run to get the list of tasks
const { tasks } = JSON.parse(
  execSync(
    'yarn turbo test --only --filter="!@asap-hub/contentful-app-*" --dry-run=json',
  ).toString(),
);

// create a matrix of tasks
const taskList = tasks
  .filter((task) => task.command !== '<NONEXISTENT>')
  .flatMap(({ package }) => {
    const shardCount = SHARDED_PACKAGES[package];

    if (shardCount) {
      // Create multiple shards for this package
      const shards = [];
      for (let shardIndex = 1; shardIndex <= shardCount; shardIndex++) {
        shards.push({
          package,
          shard: `${shardIndex}/${shardCount}`,
          shardIndex,
          shardCount,
        });
      }
      return shards;
    }

    // Regular package without sharding
    return [{ package }];
  });

// print the matrix, stringify the json
console.log(`${JSON.stringify({ include: taskList })}`);
