import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { Environment } from 'contentful-management';
import { migrateNews } from '../../src/news/news.data-migration';
import {
  newsEntry,
  squidexAsset,
  contenfulUploadAssetFields,
} from '../fixtures';
import {
  clearContentfulEntries,
  createAsset,
  convertHtmlToContentfulFormat,
  publishContentfulEntries,
  getSquidexAndContentfulClients,
} from '../../src/utils';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

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

describe('Migrate news', () => {
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
            link: { 'en-US': null },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': null },
            thumbnail: { 'en-US': null },
            title: { 'en-US': 'news' },
            publishDate: { 'en-US': undefined },
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
            link: { 'en-US': null },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': null },
            thumbnail: { 'en-US': contenfulUploadAssetFields['file']['en-US'] },
            title: { 'en-US': 'news' },
            publishDate: { 'en-US': undefined },
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
      convertHtmlToContentfulFormatMock.mockReturnValueOnce({
        document: textDocument,
        inlineAssetBodies: [],
      });

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
            link: { 'en-US': null },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': textDocument },
            thumbnail: { 'en-US': null },
            title: { 'en-US': 'news' },
            publishDate: { 'en-US': undefined },
          },
        },
      );
    });

    it('for a news that contains empty string in link', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce({
        queryNewsAndEventsContents: [
          {
            id: 'news-1',
            flatData: {
              title: 'news',
              link: '',
            },
          },
        ],
      });

      await migrateNews();

      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledWith(
        'news',
        'news-1',
        {
          fields: {
            frequency: { 'en-US': 'News Articles' },
            link: { 'en-US': null },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': null },
            thumbnail: { 'en-US': null },
            title: { 'en-US': 'news' },
            publishDate: { 'en-US': undefined },
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

      jest
        .spyOn(contenfulEnv, 'createEntryWithId')
        .mockResolvedValueOnce(newsEntry);

      const publishContentfulEntriesMock =
        publishContentfulEntries as jest.Mock;

      await migrateNews();

      expect(console.log).toHaveBeenCalledWith(
        '\x1b[31m',
        '[ERROR] There is a problem converting rich text from entry news-1',
      );

      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledWith(
        'news',
        'news-1',
        {
          fields: {
            frequency: { 'en-US': 'News Articles' },
            link: { 'en-US': null },
            linkText: { 'en-US': undefined },
            shortText: { 'en-US': undefined },
            text: { 'en-US': null },
            thumbnail: { 'en-US': null },
            title: { 'en-US': 'news' },
            publishDate: { 'en-US': undefined },
          },
        },
      );

      expect(publishContentfulEntriesMock).toHaveBeenCalledWith([newsEntry]);
    });

    it('tries to create the entry again if it fails the first time', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      const publishContentfulEntriesMock =
        publishContentfulEntries as jest.Mock;

      jest
        .spyOn(contenfulEnv, 'createEntryWithId')
        .mockImplementationOnce(() => {
          throw new Error();
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(newsEntry);
        });

      await migrateNews();

      expect(console.log).toHaveBeenCalledWith(
        '\x1b[31m',
        '[ERROR] Entry with ID news-1 was uploaded with fallback data',
      );
      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledTimes(2);
      expect(publishContentfulEntriesMock).toHaveBeenCalledWith([newsEntry]);
    });

    it('outputs a message create entry fails for the second time', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexResponseWithText,
      );

      const publishContentfulEntriesMock =
        publishContentfulEntries as jest.Mock;

      jest.spyOn(contenfulEnv, 'createEntryWithId').mockImplementation(() => {
        throw new Error();
      });

      await migrateNews();

      expect(contenfulEnv.createEntryWithId).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith(
        '\x1b[31m',
        '[ERROR] There is a problem creating entry news-1',
      );

      expect(publishContentfulEntriesMock).toHaveBeenCalledWith([]);
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
