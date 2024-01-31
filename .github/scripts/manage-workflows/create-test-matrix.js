// import execSync
const { execSync } = require('child_process');

// run turborepo dry run to get the list of tasks
const { tasks } = JSON.parse(
  execSync(
    'yarn turbo test --only --filter="!@asap-hub/contentful-app-*" --dry-run=json',
  ).toString(),
);

// create a matrix of tasks
const taskList = tasks
  .filter((task) => task.command !== '<NONEXISTENT>')
  .map(({ package }) => ({ package }));

// print the matrix, stringify the json
console.log(`${JSON.stringify({ include: taskList })}`);
