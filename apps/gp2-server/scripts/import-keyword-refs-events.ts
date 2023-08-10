import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { KeywordDataObject } from '@asap-hub/model/src/gp2';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { EventContentfulDataProvider } from '../src/data-providers/event.data-provider';
import { KeywordContentfulDataProvider } from '../src/data-providers/keyword.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';
import { map as mapKeywordID } from './mapKeywordsIds-prod';

console.log('Add tags refs to events...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const eventDataProvider = new EventContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const keywordDataProvider = new KeywordContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

let mapKeywordIds: { [key: string]: string } = mapKeywordID;

const app = async () => {
  let eventsUpdated = 0;
  let eventsFailed = 0;
  let numberOfImportedKeywords = 0;
  let keywordsAlreadyExist = 0;
  let keywordsFailed = 0;

  const events = (await eventDataProvider.fetch({ filter: { hasTags: true } }))
    .items;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });

  console.log(`updating ${events.length} events`);

  for await (const event of events) {
    let keywordsToAdd: Omit<KeywordDataObject, 'name'>[] = [];
    for await (const tag of event.tags) {
      try {
        if (!mapKeywordIds[tag]) {
          console.log(`about to create keyword: ${tag}`);
          await rateLimiter.removeTokens(5);

          const keywordId = await keywordDataProvider.create({ name: tag });
          console.log(`created keyword: ${tag} with id: ${keywordId}`);
          mapKeywordIds[tag] = keywordId;
          numberOfImportedKeywords++;
        }

        keywordsToAdd.push({ id: mapKeywordIds[tag]! });
      } catch (e) {
        if (
          (e as any)?.message?.includes(
            'Same field value present in other entry',
          )
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
      console.log(`about to update event: ${event.id}`);
      await eventDataProvider.update(event.id, {
        keywords: keywordsToAdd,
      });

      console.log(`event with id ${event.id} updated.`);
      eventsUpdated++;
    } catch (e) {
      console.log(e);
      console.log(`could not update event with id ${event.id}.`);
      eventsFailed++;
    }
  }

  console.log(`Events updated: ${eventsUpdated} failed ${eventsFailed}`);
};

app().catch(console.error);
