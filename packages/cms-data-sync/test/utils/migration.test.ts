import { Entry } from 'contentful-management';
import { migrateFromSquidexToContentfulFactory } from '../../src/utils/migration';
import { logger as loggerFunc, RED_COLOR } from '../../src/utils/logs';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';
import { loggerMock } from '../mocks/logger.mock';

describe('Migration from Squidex to Contentful', () => {
  const contentfulEnvironmentMock = getContentfulEnvironmentMock();
  const migrateFromSquidexToContentful = migrateFromSquidexToContentfulFactory(
    contentfulEnvironmentMock,
    loggerMock,
  );
  const entry = {
    isPublished: jest.fn().mockReturnValue(true),
    unpublish: jest.fn(),
    delete: jest.fn(),
    sys: {
      id: 'entry-id',
    },
  } as unknown as jest.Mocked<Entry>;

  const consoleLogRef = console.log;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    console.log = jest.fn();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = consoleLogRef;
    process.env = OLD_ENV;
  });

  describe("Cleaning up Contentful's entries", () => {
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
      contentfulEnvironmentMock.createEntryWithId.mockResolvedValueOnce(entry);

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

    test('Should update the entry if updateEntry is true and entry exists', async () => {
      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce({
        ...item,
        updateEntry: true,
      });
      entry.fields = {
        title: 'old title',
        description: 'old description',
      };
      entry.publish = jest.fn().mockResolvedValueOnce(entry);
      entry.update = jest.fn().mockResolvedValueOnce(entry);
      contentfulEnvironmentMock.getEntry.mockResolvedValueOnce(entry);

      await migrateFromSquidexToContentful(
        'entity',
        fetchData,
        parseData,
        true,
      );

      expect(entry.update).toBeCalled();
    });

    test('Should update the entry if UPSERT_IN_PLACE is true and entry exists', async () => {
      process.env.UPSERT_IN_PLACE = 'true';

      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);

      const {
        migrateFromSquidexToContentfulFactory,
      } = require('../../src/utils/migration');
      const {
        getContentfulEnvironmentMock,
      } = require('../mocks/contentful.mocks');

      const contentfulEnvironmentMock = getContentfulEnvironmentMock();
      const migrateFromSquidexToContentful =
        migrateFromSquidexToContentfulFactory(
          contentfulEnvironmentMock,
          loggerMock,
        );

      entry.fields = {
        title: 'old title',
        description: 'old description',
      };
      entry.publish = jest.fn().mockResolvedValueOnce(entry);
      entry.update = jest.fn().mockResolvedValueOnce(entry);
      contentfulEnvironmentMock.getEntry.mockResolvedValueOnce(entry);

      await migrateFromSquidexToContentful(
        'entity',
        fetchData,
        parseData,
        true,
      );

      expect(entry.update).toBeCalled();
    });

    test('Should try to create an entry if it was supposed to update it but the entry does not exist when UPSERT_IN_PLACE is true', async () => {
      process.env.UPSERT_IN_PLACE = 'true';

      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);

      const {
        migrateFromSquidexToContentfulFactory,
      } = require('../../src/utils/migration');
      const {
        getContentfulEnvironmentMock,
      } = require('../mocks/contentful.mocks');

      const contentfulEnvironmentMock = getContentfulEnvironmentMock();
      const migrateFromSquidexToContentful =
        migrateFromSquidexToContentfulFactory(
          contentfulEnvironmentMock,
          loggerMock,
        );

      contentfulEnvironmentMock.getEntry.mockRejectedValueOnce(
        new Error('{"status":404}'),
      );

      await migrateFromSquidexToContentful(
        'entity',
        fetchData,
        parseData,
        true,
      );

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

    test('Should not throw when fallback create fails when UPSERT_IN_PLACE is true but it should log the error', async () => {
      process.env.UPSERT_IN_PLACE = 'true';

      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);

      const {
        migrateFromSquidexToContentfulFactory,
      } = require('../../src/utils/migration');
      const {
        getContentfulEnvironmentMock,
      } = require('../mocks/contentful.mocks');

      const contentfulEnvironmentMock = getContentfulEnvironmentMock();
      const migrateFromSquidexToContentful =
        migrateFromSquidexToContentfulFactory(
          contentfulEnvironmentMock,
          loggerFunc,
        );

      contentfulEnvironmentMock.getEntry.mockRejectedValueOnce(
        new Error('{"status":404}'),
      );

      contentfulEnvironmentMock.createEntryWithId.mockRejectedValueOnce(
        new Error('unknown error'),
      );

      await migrateFromSquidexToContentful(
        'entity',
        fetchData,
        parseData,
        true,
      );

      expect(console.log).toHaveBeenCalledWith(
        RED_COLOR,
        `[ERROR] (Fallback update) Error creating entry squidex-id:\nError: unknown error`,
      );
    });

    test('Should not try to create an entry if it was supposed to update it but the entry does not exist when UPSERT_IN_PLACE is false and item has updateEntry as true', async () => {
      process.env.UPSERT_IN_PLACE = 'false';

      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce({
        ...item,
        updateEntry: true,
      });

      const {
        migrateFromSquidexToContentfulFactory,
      } = require('../../src/utils/migration');
      const {
        getContentfulEnvironmentMock,
      } = require('../mocks/contentful.mocks');

      const contentfulEnvironmentMock = getContentfulEnvironmentMock();
      const migrateFromSquidexToContentful =
        migrateFromSquidexToContentfulFactory(
          contentfulEnvironmentMock,
          loggerMock,
        );

      contentfulEnvironmentMock.getEntry.mockRejectedValueOnce(
        new Error('{"status":404}'),
      );

      expect(
        contentfulEnvironmentMock.createEntryWithId,
      ).not.toHaveBeenCalled();

      await expect(
        migrateFromSquidexToContentful('entity', fetchData, parseData, true),
      ).rejects.toThrowError('{"status":404}');
    });

    test('Throw error if get entry does not work for an unexpected reason (not 404 status)', async () => {
      process.env.UPSERT_IN_PLACE = 'true';

      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);

      const {
        migrateFromSquidexToContentfulFactory,
      } = require('../../src/utils/migration');
      const {
        getContentfulEnvironmentMock,
      } = require('../mocks/contentful.mocks');

      const contentfulEnvironmentMock = getContentfulEnvironmentMock();
      const migrateFromSquidexToContentful =
        migrateFromSquidexToContentfulFactory(
          contentfulEnvironmentMock,
          loggerMock,
        );

      contentfulEnvironmentMock.getEntry.mockRejectedValueOnce(
        new Error('unexpected'),
      );

      await expect(
        migrateFromSquidexToContentful('entity', fetchData, parseData, true),
      ).rejects.toThrowError('unexpected');
    });

    test('Should use a fallback parser if the item fails to create with the first attempt and error is different than 404', async () => {
      fetchData.mockResolvedValueOnce([squidexRecord]);
      parseData.mockResolvedValueOnce(item);
      contentfulEnvironmentMock.createEntryWithId.mockRejectedValueOnce(
        new Error('{"status":500}'),
      );
      contentfulEnvironmentMock.createEntryWithId.mockResolvedValueOnce(entry);

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
        true,
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
