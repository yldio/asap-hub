const { execSync } = require('child_process');

// Packages that should be sharded (with their shard count)
const SHARDED_PACKAGES = {
  '@asap-hub/crn-frontend': 8, // Update as needed based on the number of tests in the package
  '@asap-hub/react-components': 6, // Update as needed based on the number of tests in the package
  '@asap-hub/gp2-frontend': 4, // Update as needed based on the number of tests in the package
};

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
