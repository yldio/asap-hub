import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { KeywordDataObject } from '@asap-hub/model/src/gp2';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { KeywordContentfulDataProvider } from '../src/data-providers/keyword.data-provider';
import { UserContentfulDataProvider } from '../src/data-providers/user.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';
import { map as mapKeywordID } from './mapKeywordsIds-prod';

console.log('Add tags refs to users...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const keywordDataProvider = new KeywordContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

let mapKeywordIds: { [key: string]: string } = mapKeywordID;

const app = async () => {
  let usersUpdated = 0;
  let usersFailed = 0;
  let numberOfImportedKeywords = 0;
  let keywordsAlreadyExist = 0;
  let keywordsFailed = 0;

  const users = (
    await userDataProvider.fetch({ filter: { hasKeywords: true } })
  ).items;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });

  console.log(`updating ${users.length} users`);

  for await (const user of users) {
    let keywordsToAdd: Omit<KeywordDataObject, 'name'>[] = [];
    for (const keyword of user.keywords) {
      try {
        if (!mapKeywordIds[keyword]) {
          console.log(`about to create keyword: ${keyword}`);
          await rateLimiter.removeTokens(5);

          const keywordId = await keywordDataProvider.create({ name: keyword });
          console.log(`created keyword: ${keyword} with id: ${keywordId}`);
          mapKeywordIds[keyword] = keywordId;
          numberOfImportedKeywords++;
        }

        keywordsToAdd.push({ id: mapKeywordIds[keyword]! });
      } catch (e) {
        if (
          e instanceof Error &&
          e.message?.includes('Same field value present in other entry')
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

    try {
      console.log(`about to update user: ${user.firstName} ${user.lastName}`);
      await userDataProvider.update(user.id, {
        tags: keywordsToAdd,
      });

      console.log(`user with id ${user.id} updated.`);
      usersUpdated++;
    } catch (e) {
      console.log(e);
      console.log(`could not update user with id ${user.id}.`);
      usersFailed++;
    }
  }

  console.log(`Total Users updated: ${usersUpdated} failed ${usersFailed}`);
};

app().catch(console.error);
