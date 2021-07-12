const algoliasearch = require('algoliasearch');

const main = async () => {
  if (
    ALGOLIA_INDEX === 'asap-hub_research_outputs_dev' ||
    ALGOLIA_INDEX === 'asap-hub_research_outputs_prod'
  ) {
    throw new Error('DEV and PROD indices cannot be deleted');
  }

  const index = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  ).initIndex(process.env.ALGOLIA_INDEX);

  await index.delete();
};

main().catch(console.error);
