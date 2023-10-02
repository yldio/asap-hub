import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { writeFileSync } from 'fs';
import { RateLimiter } from 'limiter';
import util from 'util';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { TagContentfulDataProvider } from '../src/data-providers/tag.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';

console.log('Importing tags...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const tagDataProvider = new TagContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

let mapTagID: { [key: string]: string } = {};
const app = async () => {
  let numberOfImportedTags = 0;
  let tagsAlreadyExist = 0;
  let tagsFailed = 0;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });

  for await (const tag of gp2.tags) {
    try {
      console.log(`about to create tag: ${tag}`);
      await rateLimiter.removeTokens(5);

      const tagId = await tagDataProvider.create({ name: tag });
      console.log(`created tag: ${tag} with id: ${tagId}`);

      mapTagID[tag] = tagId;

      numberOfImportedTags++;
      console.log(`number of tags imported so far: ${numberOfImportedTags} `);
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Same field value present in other entry')
      ) {
        tagsAlreadyExist++;
      } else {
        tagsFailed++;
      }
    }
  }

  writeFileSync('mapTagsId.ts', 'export const map = ' + util.inspect(mapTagID));

  console.log(
    `Imported ${numberOfImportedTags} tags, already exist ${tagsAlreadyExist}, failed ${tagsFailed}`,
  );
};

app().catch(console.error);
