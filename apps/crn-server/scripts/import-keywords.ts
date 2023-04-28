// @ts-nocheck
import { parseArgs } from 'node:util';
import { open } from 'node:fs/promises';

import { getAccessTokenFactory, SquidexRest } from '@asap-hub/squidex';
import { clientId, clientSecret, baseUrl, appName } from '../src/config';

const getAuthToken = getAccessTokenFactory({
  clientId,
  clientSecret,
  baseUrl,
});

const tagRestClient = new SquidexRest(getAuthToken, 'research-tags', {
  appName,
  baseUrl,
});

const dryRunFlag = 'dry-run';
const app = async () => {
  const {
    values: { csv, [dryRunFlag]: dryRun },
  } = parseArgs({
    options: {
      csv: { type: 'string' },
      'dry-run': { type: 'boolean' },
    },
  });

  if (!csv) {
    throw new Error(`--csv must be provided`);
  }

  const existingKeyowrds = await getKeywordsFromSquidex();

  const csvWords = await fromCSV(csv);

  const keywords = csvWords.filter((w) => !existingKeyowrds.includes(w));

  const results = await Promise.allSettled(
    keywords.map((k) => importKeyword(k!, dryRun!)),
  );

  const summary = { imported: 0, failed: 0 };

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.log(result.reason);
      summary.failed++;
    } else {
      summary.imported++;
    }
  });

  console.log('finished importing keywords');
  console.log(summary);
};

async function getKeywordsFromSquidex() {
  let page = 1;
  let recordCount = 0;
  let total;
  const keywords = [];
  const take = 200;

  do {
    console.log('fetching tags...');
    const res = await tagRestClient.fetch({
      take,
      skip: (page - 1) * take,
      filter: {
        op: 'eq',
        path: 'data.category.iv',
        value: 'Keyword',
      },
    });

    keywords.push(...res.items.map((i) => i?.data?.name?.iv));

    total = res.total;
    page++;
    recordCount += res.items.length;
  } while (total > recordCount);

  return keywords;
}

async function fromCSV(path: string) {
  const file = await open(path);
  const keywords = [];

  for await (const line of file.readLines()) {
    const [keyword] = line.split(',');
    keywords.push(keyword);
  }

  return keywords;
}

async function importKeyword(name: string, dryRun: boolean) {
  if (dryRun) {
    console.log(`[dry run] - importing ${name}`);
    return;
  }

  return tagRestClient.create({
    name: { iv: name },
    category: { iv: 'Keyword' },
    entities: { iv: ['Research Output'] },
  });
}

app().catch(console.error);
