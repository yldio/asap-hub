import { Environment, Entry } from '@asap-hub/contentful';
import { EntryDataProvider } from '../../../src/data-providers/types';
import { EntryContentfulDataProvider } from '../../../src/data-providers/contentful/entry.data-provider';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Entry data provider', () => {
  const getSnapshotCollection = (items: any[]) => ({
    items,
    sys: { type: 'Array' as const },
    total: items.length,
    skip: 0,
    limit: 100,
    toPlainObject: jest.fn(),
  });
  const environmentMock = getContentfulEnvironmentMock({
    getEntrySnapshots: jest.fn(),
  });
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const entryDataProvider: EntryDataProvider = new EntryContentfulDataProvider(
    contentfulRestClientMock,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('not implemented', async () => {
      await expect(entryDataProvider.fetch(null)).rejects.toThrow();
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      await expect(entryDataProvider.fetchById('123')).rejects.toThrow();
    });
  });

  describe('getChangedFields', () => {
    test('should return empty array if entry is not published or version < 2', async () => {
      environmentMock.getEntry.mockResolvedValueOnce({
        sys: {
          publishedVersion: 1,
        },
        fields: {
          title: { 'en-US': 'test' },
        },
      } as unknown as Entry);

      const result = await entryDataProvider.getChangedFields('entry-1');

      expect(result).toEqual([]);
      expect(environmentMock.getEntrySnapshots).not.toHaveBeenCalled();
    });

    test('should return empty array if no previous snapshot exists', async () => {
      environmentMock.getEntry.mockResolvedValueOnce({
        sys: {
          publishedVersion: 3,
        },
        fields: {
          title: { 'en-US': 'test' },
        },
      } as unknown as Entry);

      environmentMock.getEntrySnapshots.mockResolvedValueOnce(
        getSnapshotCollection([]),
      );

      const result = await entryDataProvider.getChangedFields('entry-1');

      expect(result).toEqual([]);
    });

    test('should return changed fields between snapshots', async () => {
      environmentMock.getEntry.mockResolvedValueOnce({
        sys: {
          publishedVersion: 3,
        },
        fields: {
          title: { 'en-US': 'new title' },
          description: { 'en-US': 'same' },
        },
      } as unknown as Entry);

      environmentMock.getEntrySnapshots.mockResolvedValueOnce(
        getSnapshotCollection([
          {},
          {
            snapshot: {
              fields: {
                title: { 'en-US': 'old title' },
                description: { 'en-US': 'same' },
              },
            },
          },
        ]),
      );

      const result = await entryDataProvider.getChangedFields('entry-1');

      expect(result).toEqual(['title']);
    });

    test('should detect added and removed fields', async () => {
      environmentMock.getEntry.mockResolvedValueOnce({
        sys: {
          publishedVersion: 3,
        },
        fields: {
          title: { 'en-US': 'title' },
          newField: { 'en-US': 'value' },
        },
      } as unknown as Entry);

      environmentMock.getEntrySnapshots.mockResolvedValueOnce(
        getSnapshotCollection([
          {},
          {
            snapshot: {
              fields: {
                title: { 'en-US': 'title' },
                oldField: { 'en-US': 'removed' },
              },
            },
          },
        ]),
      );

      const result = await entryDataProvider.getChangedFields('entry-1');

      expect(result.sort()).toEqual(['newField', 'oldField']);
    });

    test('should return empty array if no fields changed', async () => {
      environmentMock.getEntry.mockResolvedValueOnce({
        sys: {
          publishedVersion: 3,
        },
        fields: {
          title: { 'en-US': 'same' },
        },
      } as unknown as Entry);

      environmentMock.getEntrySnapshots.mockResolvedValueOnce(
        getSnapshotCollection([
          {},
          {
            snapshot: {
              fields: {
                title: { 'en-US': 'same' },
              },
            },
          },
        ]),
      );

      const result = await entryDataProvider.getChangedFields('entry-1');

      expect(result).toEqual([]);
    });
  });
});
