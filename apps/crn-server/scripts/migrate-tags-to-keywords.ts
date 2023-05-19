// @ts-nocheck
import { parseArgs } from 'node:util';
import { createWriteStream } from 'node:fs';
import pThrottle from 'p-throttle';
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

const researchOutputRestClient = new SquidexRest(
  getAuthToken,
  'research-outputs',
  {
    appName,
    baseUrl,
  },
  {
    unpublished: true,
  },
);

const dryRunFlag = 'dry-run';

const app = async () => {
  const {
    values: { [dryRunFlag]: dryRun },
  } = parseArgs({
    options: {
      'dry-run': { type: 'boolean' },
    },
  });

  if (dryRun) {
    console.log('executing dry run');
  }

  const keywords = await getKeywordsFromSquidex();
  const lookup = createLookup(keywords);
  const missingKeywords = {};

  const researchOutputs = await getResearchOutputFromSquidex();
  const throttle = pThrottle({
    limit: 50,
    interval: 1000,
  });

  const throttledMigrateTagsToKeywords = throttle(async (researchOutput) =>
    migrateTagsToKeywords(researchOutput, lookup, missingKeywords, dryRun),
  );

  const results = await Promise.allSettled(
    researchOutputs.map((r) => throttledMigrateTagsToKeywords(r)),
  );

  const summary = { updated: 0, failed: 0 };

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.log(result.reason);
      summary.failed++;
    } else {
      summary.updated++;
    }
  });

  console.log('finished migrating tags to keywords', summary);

  if (Object.keys(missingKeywords).length) {
    const filename = `${new Date().toISOString()}_missing_keywords.json`;
    const stream = createWriteStream(filename);
    console.log(`creating file ${filename}`);

    for (const [id, tags] of Object.entries(missingKeywords)) {
      stream.write(`\n${JSON.stringify({ id, tags })}`);
    }
  }
};

app().catch(console.error);

async function migrateTagsToKeywords(
  researchOutput,
  lookup,
  missingKeywords,
  dryRun,
) {
  const existingKeyowrds = researchOutput.data?.keywords?.iv || [];
  const keywords = new Set(existingKeyowrds);

  researchOutput.data.tags.iv?.forEach((tag) => {
    const id = lookup[tag.toLowerCase()];
    if (id) {
      keywords.add(id);
    } else {
      if (missingKeywords[researchOutput.id]) {
        missingKeywords[researchOutput.id].push(tag);
      } else {
        missingKeywords[researchOutput.id] = [tag];
      }
    }
  });

  if (dryRun) {
    return;
  }

  if (keywords.size) {
    return researchOutputRestClient.patch(researchOutput.id, {
      keywords: { iv: [...keywords] },
    });
  }
}

function createLookup(words) {
  return words.reduce((map, word) => {
    map[word.data.name.iv.toLowerCase()] = word.id;
    return map;
  }, {});
}
//
async function getResearchOutputFromSquidex() {
  let page = 1;
  let recordCount = 0;
  let total;
  const researchOutputs = [];
  const take = 200;

  console.log('fetching outputs...');
  do {
    const res = await researchOutputRestClient.fetch({
      take,
      skip: (page - 1) * take,
    });

    researchOutputs.push(
      ...res.items.filter((r) => r.data.tags && r.data.tags.iv?.length !== 0),
    );

    total = res.total;
    page++;
    recordCount += res.items.length;
  } while (total > recordCount);
  return researchOutputs;
}

async function getKeywordsFromSquidex() {
  let page = 1;
  let recordCount = 0;
  let total;
  const keywords = [];
  const take = 200;

  console.log('fetching tags...');
  do {
    const res = await tagRestClient.fetch({
      take,
      skip: (page - 1) * take,
      filter: {
        op: 'eq',
        path: 'data.category.iv',
        value: 'Keyword',
      },
    });

    keywords.push(...res.items);

    total = res.total;
    page++;
    recordCount += res.items.length;
  } while (total > recordCount);

  return keywords;
}
