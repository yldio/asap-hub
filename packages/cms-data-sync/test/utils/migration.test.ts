import { Entry } from 'contentful-management';
import { migrateFromSquidexToContentfulFactory } from '../../src/utils/migration';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';
import { loggerMock } from '../mocks/logger.mock';

describe('Migration from Squidex to Contentful', () => {
  const contentfulEnvironmentMock = getContentfulEnvironmentMock();
  const migrateFromSquidexToContentful = migrateFromSquidexToContentfulFactory(
    contentfulEnvironmentMock,
    loggerMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Cleaning up Contentful's entries", () => {
    const entry = {
      isPublished: jest.fn().mockReturnValue(true),
      unpublish: jest.fn(),
      delete: jest.fn(),
      sys: {
        id: 'entry-id',
      },
    } as unknown as jest.Mocked<Entry>;
    const fetchData = jest.fn().mockResolvedValue([]);
    const parseData = jest.fn();

    test('Should fetch records from Squidex and fetch all existing records from Contentful', async () => {
      contentfulEnvironmentMock.getEntries.mockResolvedValueOnce({
        items: [],
      } as any);

      await migrateFromSquidexToContentful('entity', fetchData, parseData);

      expect(fetchData).toBeCalledTimes(1);
      expect(parseData).toBeCalledTimes(0);
      expect(contentfulEnvironmentMock.getEntries).toBeCalledTimes(1);
    });

    test('Should fetch all existing records from Contentful, unpublish the published one and delete it', async () => {
      contentfulEnvironmentMock.getEntries.mockResolvedValueOnce({
        items: [entry],
      } as any);

      await migrateFromSquidexToContentful('entity', fetchData, parseData);

      expect(entry.unpublish).toBeCalledTimes(1);
      expect(entry.delete).toBeCalledTimes(1);
    });
  });

  describe('Publishing entries', () => {
    const fetchData = jest.fn();
    const parseData = jest.fn();
    const squidexRecord = {
      id: 'squidex-id',
      data: {
        title: {
          iv: 'title',
        },
        description: {
          iv: 'description',
        },
      },
    };
    const item = {
      id: 'squidex-id',
      title: 'title',
      description: 'description',
    };

    beforeEach(() => {
      contentfulEnvironmentMock.getEntries.mockResolvedValueOnce({
        items: [],
      } as any);
    });

    test('Should parse the item and create a new record in Contentful', async () => {
      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);

      await migrateFromSquidexToContentful('entity', fetchData, parseData);

      expect(contentfulEnvironmentMock.createEntryWithId).toBeCalledWith(
        'entity',
        'squidex-id',
        {
          fields: {
            title: { 'en-US': 'title' },
            description: { 'en-US': 'description' },
          },
        },
      );
    });

    test('Should use a fallback parser if the item fails to create with the first attempt', async () => {
      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);
      contentfulEnvironmentMock.createEntryWithId.mockRejectedValueOnce(
        new Error(),
      );
      const itemWithoutDescription = {
        ...item,
        description: undefined,
      };
      const fallbackParser = jest
        .fn()
        .mockResolvedValueOnce(itemWithoutDescription);

      await migrateFromSquidexToContentful(
        'entity',
        fetchData,
        parseData,
        fallbackParser,
      );

      expect(contentfulEnvironmentMock.createEntryWithId).toBeCalledWith(
        'entity',
        'squidex-id',
        {
          fields: {
            title: { 'en-US': 'title' },
            description: { 'en-US': undefined },
          },
        },
      );
    });
  });
});
