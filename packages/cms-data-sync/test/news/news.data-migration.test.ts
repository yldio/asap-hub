import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { migrateNews } from '../../src/news/news.data-migration';
import { entry, getContentfulEnvironmentMock } from '../fixtures';
import {
  clearContentfulEntries,
  publishContentfulEntries,
  getSquidexAndContentfulClients,
} from '../../src/utils';
import { Environment } from 'contentful-management';

jest.mock('../../src/utils/setup');
jest.mock('../../src/utils/entries');

describe('migrateNews', () => {
  let contenfulEnv: Environment;
  let squidexGraphqlClientMock: jest.Mocked<SquidexGraphqlClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    squidexGraphqlClientMock = {
      request: jest.fn(),
    };
    contenfulEnv = getContentfulEnvironmentMock();
    const mock = getSquidexAndContentfulClients as jest.Mock; // spy on otherFn
    mock.mockResolvedValueOnce({
      contentfulEnvironment: contenfulEnv,
      squidexGraphqlClient: squidexGraphqlClientMock,
    });

    jest
      .spyOn(entry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(entry));

    squidexGraphqlClientMock.request.mockResolvedValueOnce({
      queryNewsAndEventsContents: [
        {
          id: 'news-1',
          flatData: {
            title: 'news',
          },
        },
      ],
    });

    jest.spyOn(contenfulEnv, 'getEntries').mockResolvedValueOnce({
      total: 1,
      items: [entry],
      skip: 0,
      limit: 10,
      toPlainObject: jest.fn(),
      sys: { type: 'Array' },
    });

    jest.spyOn(contenfulEnv, 'createEntryWithId').mockResolvedValueOnce(entry);
  });

  it('clear contentful entries', async () => {
    await migrateNews();
    const clearContentfulEntriesMock = clearContentfulEntries as jest.Mock;

    expect(clearContentfulEntriesMock).toHaveBeenCalled();
  });

  it('create news contentful entries', async () => {
    await migrateNews();

    expect(contenfulEnv.createEntryWithId).toHaveBeenCalledWith(
      'news',
      'news-1',
      {
        fields: {
          frequency: { 'en-US': 'News Articles' },
          link: { 'en-US': undefined },
          linkText: { 'en-US': undefined },
          shortText: { 'en-US': undefined },
          text: { 'en-US': null },
          thumbnail: { 'en-US': null },
          title: { 'en-US': 'news' },
        },
      },
    );
  });

  it('publish contentful entries', async () => {
    const publishContentfulEntriesMock = publishContentfulEntries as jest.Mock;

    await migrateNews();

    expect(publishContentfulEntriesMock).toHaveBeenCalled();
  });
});
