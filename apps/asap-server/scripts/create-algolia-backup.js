const algoliasearch = require('algoliasearch');
const fs = require('fs/promises');

const main = async () => {
  const index = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  ).initIndex(process.env.ALGOLIA_INDEX);

  let hits = [];

  await index.browseObjects({
    batch: (objects) => (hits = hits.concat(objects)),
  });

  await fs.writeFile(
    process.env.FILE_NAME,
    JSON.stringify(hits, null, 2),
    'utf-8',
  );
};

main().catch(console.error);
