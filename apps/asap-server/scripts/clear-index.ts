import algoliasearch from 'algoliasearch';
import {
  algoliaAppId,
  algoliaCiApiKey,
  algoliaResearchOutputIndex,
} from '../src/config';

const main = async () => {
  console.log({
    algoliaAppId,
    algoliaCiApiKey,
    algoliaResearchOutputIndex,
  });
  const index = algoliasearch(algoliaAppId, algoliaCiApiKey).initIndex(
    algoliaResearchOutputIndex,
  );

  await index.clearObjects();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
