import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { migrateNews } from '../../src/news/news.data-migration';
import { entry, getContentfulEnvironmentMock, squidexAsset } from '../fixtures';
import {
  clearContentfulEntries,
  createAssetLink,
  convertHtmlToContentfulFormat,
  publishContentfulEntries,
  getSquidexAndContentfulClients,
} from '../../src/utils';
import { Environment } from 'contentful-management';

jest.mock('../../src/utils/setup');
jest.mock('../../src/utils/entries');
jest.mock('../../src/utils/assets');
jest.mock('../../src/utils/rich-text');

const squidexResponseWithTitleOnly = {
  queryNewsAndEventsContents: [
    {
      id: 'news-1',
      flatData: {
        title: 'news',
      },
    },
  ],
};

const squidexResponseWithThumb = {
  queryNewsAndEventsContents: [
    {
      id: 'news-1',
      flatData: {
        title: 'news',
        thumbnail: [squidexAsset],
      },
    },
  ],
};

const squidexResponseWithText = {
  queryNewsAndEventsContents: [
    {
      id: 'news-1',
      flatData: {
        title: 'news',
        text: '<p>Hello world</p>',
      },
    },
  ],
};

describe('migrateNews', () => {
  let contenfulEnv: Environment;
  let squidexGraphqlClientMock: jest.Mocked<SquidexGraphqlClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    contenfulEnv = getContentfulEnvironmentMock();
    squidexGraphqlClientMock = {
      request: jest.fn(),
    };

    (getSquidexAndContentfulClients as jest.Mock).mockResolvedValueOnce({
      contentfulEnvironment: contenfulEnv,
      squidexGraphqlClient: squidexGraphqlClientMock,
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

    jest
      .spyOn(entry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(entry));
  });

  it('clears contentful entries', async () => {
    squidexGraphqlClientMock.request.mockResolvedValueOnce(
      squidexResponseWithTitleOnly,
    );

    await migrateNews();
    const clearContentfulEntriesMock = clearContentfulEntries as jest.Mock;

    expect(clearContentfulEntriesMock).toHaveBeenCalled();
  });

  describe('creates contentful entries', () => {
    it('for a news that contains only title', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithTitleOnly,
      );

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

    it('for a news that contains thumbnail', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithThumb,
      );

      await migrateNews();

      const createAssetLinkMock = createAssetLink as jest.Mock;

      expect(createAssetLinkMock).toHaveBeenCalled();
    });

    it('for a news that contains text', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      await migrateNews();

      const convertHtmlToContentfulFormatMock =
        convertHtmlToContentfulFormat as jest.Mock;

      expect(convertHtmlToContentfulFormatMock).toHaveBeenCalled();
    });
  });

  it('publish contentful entries', async () => {
    squidexGraphqlClientMock.request.mockResolvedValueOnce(
      squidexResponseWithTitleOnly,
    );
    const publishContentfulEntriesMock = publishContentfulEntries as jest.Mock;

    await migrateNews();

    expect(publishContentfulEntriesMock).toHaveBeenCalled();
  });
});
