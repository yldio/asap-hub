import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { KeywordDataObject } from '@asap-hub/model/src/gp2';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { KeywordContentfulDataProvider } from '../src/data-providers/keyword.data-provider';
import { ProjectContentfulDataProvider } from '../src/data-providers/project.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';
import { map as mapKeywordID } from './mapKeywordsIds-prod';

console.log('Add tags refs to projects...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const projectDataProvider = new ProjectContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const keywordDataProvider = new KeywordContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

let mapKeywordIds: { [key: string]: string } = mapKeywordID;

const app = async () => {
  let projectsUpdated = 0;
  let projectsFailed = 0;
  let numberOfImportedKeywords = 0;
  let keywordsAlreadyExist = 0;
  let keywordsFailed = 0;

  const projects = (
    await projectDataProvider.fetch({ filter: { hasKeywords: true } })
  ).items;

  console.log(`starting import for ${contentfulEnvId}`);
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 5,
    interval: 5000,
  });

  console.log(`updating ${projects.length} projects`);

  for await (const project of projects) {
    let keywordsToAdd: Omit<KeywordDataObject, 'name'>[] = [];
    for await (const keyword of project.keywords) {
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
      console.log(`about to update project: ${project.id}`);
      await projectDataProvider.update(project.id, {
        tags: keywordsToAdd,
      });

      console.log(`project with id ${project.id} updated.`);
      projectsUpdated++;
    } catch (e) {
      console.log(e);
      console.log(`could not update project with id ${project.id}.`);
      projectsFailed++;
    }
  }

  console.log(
    `Total Projects updated: ${projectsUpdated} failed ${projectsFailed}`,
  );
};

app().catch(console.error);
