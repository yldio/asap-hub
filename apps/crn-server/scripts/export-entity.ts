import { EntityData, EntityResponses } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import { promises as fs } from 'fs';
import Events from '../src/controllers/event.controller';
import ExternalAuthors from '../src/controllers/external-author.controller';
import News from '../src/controllers/news.controller';
import ResearchOutputs from '../src/controllers/research-output.controller';
import Teams from '../src/controllers/team.controller';
import Tutorials from '../src/controllers/tutorial.controller';
import Users from '../src/controllers/user.controller';
import WorkingGroups from '../src/controllers/working-group.controller';
import InterestGroups from '../src/controllers/interest-group.controller';
import { getEventDataProvider } from '../src/dependencies/events.dependencies';
import { getExternalAuthorDataProvider } from '../src/dependencies/external-authors.dependencies';
import { getNewsDataProvider } from '../src/dependencies/news.dependencies';
import { getResearchOutputDataProvider } from '../src/dependencies/research-outputs.dependencies';
import { getResearchTagDataProvider } from '../src/dependencies/research-tags.dependencies';
import { getTeamDataProvider } from '../src/dependencies/team.dependencies';
import { getTutorialDataProvider } from '../src/dependencies/tutorial.dependencies';

import {
  getAssetDataProvider,
  getUserDataProvider,
  getResearchTagsDataProvider,
} from '../src/dependencies/users.dependencies';
import { getWorkingGroupDataProvider } from '../src/dependencies/working-groups.dependencies';
import { getInterestGroupDataProvider } from '../src/dependencies/interest-groups.dependencies';

type EntityResponsesCRN = EntityResponses['crn'];
export const PAGE_SIZE = 10;
export const exportEntity = async (
  entity: keyof EntityResponsesCRN,
  filename?: string,
): Promise<void> => {
  const controller = getController(entity);
  const file = await fs.open(filename || `${entity}.json`, 'w');
  let recordCount = 0;
  let total: number;
  let records: ListResponse<EntityData>;
  let page = 1;

  await file.write('[\n');

  do {
    records = await controller.fetch({
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    });

    total = records.total;

    if (page != 1) {
      await file.write(',\n');
    }

    await file.write(
      JSON.stringify(
        records.items.map((record) => transformRecords(record, entity)),
        null,
        2,
      ).slice(1, -1),
    );

    page++;
    recordCount += records.items.length;
  } while (total > recordCount);

  await file.write(']');

  console.log(`Finished exporting ${recordCount} records`);
};

const getController = (entity: keyof EntityResponsesCRN) => {
  const userDataProvider = getUserDataProvider();

  const researchOutputDataProvider = getResearchOutputDataProvider();
  const researchTagDataProvider = getResearchTagDataProvider();
  const externalAuthorDataProvider = getExternalAuthorDataProvider();

  const assetDataProvider = getAssetDataProvider();

  const eventDataProvider = getEventDataProvider();

  const teamDataProvider = getTeamDataProvider();
  const workingGroupDataProvider = getWorkingGroupDataProvider();
  const tutorialDataProvider = getTutorialDataProvider();
  const newsDataProvider = getNewsDataProvider();
  const interestGroupDataProvider = getInterestGroupDataProvider();

  const controllerMap = {
    user: new Users(
      userDataProvider,
      assetDataProvider,
      getResearchTagsDataProvider(),
    ),
    'research-output': new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    'external-author': new ExternalAuthors(externalAuthorDataProvider),
    event: new Events(eventDataProvider),
    team: new Teams(teamDataProvider),
    'working-group': new WorkingGroups(workingGroupDataProvider),
    'interest-group': new InterestGroups(
      interestGroupDataProvider,
      userDataProvider,
    ),
    tutorial: new Tutorials(tutorialDataProvider),
    news: new News(newsDataProvider),
  };

  return controllerMap[entity];
};

const transformRecords = (
  record: EntityData,
  type: keyof EntityResponsesCRN,
) => {
  const payload = {
    ...record,
    objectID: record.id,
    __meta: {
      type,
    },
  };

  if (type === 'research-output' && 'subtype' in record) {
    const subtype = record.subtype;

    return {
      ...payload,
      _tags: [
        ...record.methods,
        ...record.organisms,
        ...record.environments,
        ...(subtype ? [subtype] : []),
        ...record.keywords,
      ],
    };
  }

  if (type === 'user' && 'expertiseAndResourceTags' in record) {
    return payload;
  }

  if (type === 'event' && 'tags' in record) {
    return {
      ...payload,
      _tags: record.tags,
    };
  }

  if (type === 'team' && 'expertiseAndResourceTags' in record) {
    return {
      ...payload,
      _tags: record.expertiseAndResourceTags,
    };
  }

  if (type === 'working-group' && 'tags' in record) {
    return {
      ...payload,
      _tags: record.tags,
    };
  }

  if (type === 'tutorial' && 'tags' in record) {
    return {
      ...payload,
      _tags: record.tags,
    };
  }

  if (type === 'news' && 'tags' in record) {
    return {
      ...payload,
      _tags: record.tags,
    };
  }

  return payload;
};
