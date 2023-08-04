import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { KeywordContentfulDataProvider } from '../src/data-providers/keyword.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';

console.log('Importing keywords...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const keywordDataProvider = new KeywordContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const app = async () => {
  let numberOfImportedKeywords = 0;
  let keywordsAlreadyExist = 0;
  let keywordsFailed = 0;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });

  for await (const keyword of gp2.keywords) {
    try {
      console.log(`about to create keyword: ${keyword}`);
      await rateLimiter.removeTokens(5);

      const keywordId = await keywordDataProvider.create({ name: keyword });
      console.log(`created keyword: ${keyword} with id: ${keywordId}`);

      numberOfImportedKeywords++;
      console.log(
        `number of keywords imported so far: ${numberOfImportedKeywords} `,
      );
    } catch (e) {
      if (
        (e as any)?.message?.includes('Same field value present in other entry')
      ) {
        keywordsAlreadyExist++;
      } else {
        keywordsFailed++;
      }
    }
  }

  console.log(
    `Imported ${numberOfImportedKeywords} keywords, already exist ${keywordsAlreadyExist}, failed ${keywordsFailed}`,
  );
};

app().catch(console.error);
