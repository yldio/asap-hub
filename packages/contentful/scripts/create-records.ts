import minimist from 'minimist';
import Chance from 'chance';
import { getRateLimitedClient, addLocaleToFields } from '../src';

const chance = new Chance();

const space = process.env.CONTENTFUL_SPACE_ID!;
const environment = process.env.CONTENTFUL_ENV_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const args = minimist(process.argv.slice(2));

const createData = () => {
  return {
    firstName: chance.first(),
    lastName: chance.last(),
    email: `${chance.guid()}@example.com`,
    role: 'Hidden',
    lastUpdated: new Date().toISOString(),
  };
};

const createRecords = async ({ count } = { count: 10 }) => {
  const client = await getRateLimitedClient({
    space,
    environment,
    accessToken: contentfulManagementAccessToken,
    rateLimit: 3, // req/s
  });

  console.log(`Space:       ${space}`);
  console.log(`Environment: ${environment}`);

  console.log(`Creating ${count} records:`);

  let n = 0;
  while (n < count) {
    const record = createData();
    const entry = await client.createEntry('users', {
      fields: addLocaleToFields(record),
    });
    await entry.publish();
    process.stdout.write('.');
    n++;
  }
  console.log('\nDone.');
};

Promise.resolve()
  .then(() => createRecords({ count: parseInt(args.n, 10) || 10 }))
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
