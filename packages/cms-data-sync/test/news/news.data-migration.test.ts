import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { migrateNews } from '../../src/news/news.data-migration';
import {
  newsEntry,
  squidexAsset,
  contenfulUploadAssetFields,
} from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks';
import {
  clearContentfulEntries,
  createAsset,
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

  const consoleLogRef = console.log;

  beforeEach(() => {
    console.log = jest.fn();

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
      items: [newsEntry],
      skip: 0,
      limit: 10,
      toPlainObject: jest.fn(),
      sys: { type: 'Array' },
    });

    jest
      .spyOn(newsEntry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(newsEntry));
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = consoleLogRef;
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

      const createAssetMock = createAsset as jest.Mock;
      createAssetMock.mockResolvedValueOnce(
        contenfulUploadAssetFields['file']['en-US'],
      );

      await migrateNews();

      expect(createAssetMock).toHaveBeenCalledWith(expect.anything(), [
        {
          fileName: 'ASAP Network thumbnail.jpg',
          fileType: 'jpeg',
          id: 'asset-id',
          mimeType: 'image/jpeg',
          thumbnailUrl: 'www.thumbnail.com/asset.png',
        },
      ]);

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
            thumbnail: { 'en-US': contenfulUploadAssetFields['file']['en-US'] },
            title: { 'en-US': 'news' },
          },
        },
      );
    });

    it('for a news that contains text', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      const textDocument = {
        content: [
          {
            content: [
              {
                data: {},
                marks: [],
                value: 'Hello world',
                nodeType: 'text',
              },
            ],
            data: {},
            nodeType: 'paragraph',
          },
        ],
        data: {},
        nodeType: 'document',
      };

      const convertHtmlToContentfulFormatMock =
        convertHtmlToContentfulFormat as jest.Mock;
      convertHtmlToContentfulFormatMock.mockReturnValueOnce(textDocument);

      await migrateNews();

      expect(convertHtmlToContentfulFormatMock).toHaveBeenCalledWith(
        '<p>Hello world</p>',
      );

      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledWith(
        'news',
        'news-1',
        {
          fields: {
            frequency: { 'en-US': 'News Articles' },
            link: { 'en-US': undefined },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': textDocument },
            thumbnail: { 'en-US': null },
            title: { 'en-US': 'news' },
          },
        },
      );
    });
  });

  describe('error handling', () => {
    it('outputs a message when converting from html to contenful format gives an error', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      const convertHtmlToContentfulFormatMock =
        convertHtmlToContentfulFormat as jest.Mock;
      convertHtmlToContentfulFormatMock.mockImplementationOnce(() => {
        throw new Error();
      });

      await migrateNews();

      expect(console.log).toHaveBeenCalledWith(
        'There is a problem converting rich text from entry news-1',
      );
    });

    it('tries to create the entry again if it fails the first time', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      jest
        .spyOn(contenfulEnv, 'createEntryWithId')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await migrateNews();

      expect(console.log).toHaveBeenCalledWith(
        'Entry with news-1 was uploaded without rich text',
      );
      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledTimes(2);
    });

    it('outputs a message create entry fails for the second time', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      jest.spyOn(contenfulEnv, 'createEntryWithId').mockImplementation(() => {
        throw new Error();
      });

      await migrateNews();

      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith(
        'There is a problem creating entry news-1',
      );
    });

    it('does not fail if squidex does not return anything', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce({});
      const publishContentfulEntriesMock =
        publishContentfulEntries as jest.Mock;

      await migrateNews();

      expect(contenfulEnv.createEntryWithId).not.toHaveBeenCalled();
      expect(publishContentfulEntriesMock).toHaveBeenCalled();
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
