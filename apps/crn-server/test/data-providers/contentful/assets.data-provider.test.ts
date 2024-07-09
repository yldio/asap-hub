import { Environment, Asset } from '@asap-hub/contentful';
import { AssetDataProvider } from '../../../src/data-providers/types';
import { AssetContentfulDataProvider } from '../../../src/data-providers/contentful/asset.data-provider';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Assets data provider', () => {
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const assetsDataProvider: AssetDataProvider = new AssetContentfulDataProvider(
    contentfulRestClientMock,
  );

  const processMock = jest.fn();
  const publishMock = jest.fn();

  beforeEach(jest.resetAllMocks);
  beforeEach(() => {
    environmentMock.createAssetFromFiles.mockResolvedValueOnce({
      processForAllLocales: processMock,
      sys: {
        id: '123',
      },
      fields: {
        file: {
          'en-US': {
            url: 'https://test-url',
            fileName: 'abc.jpeg',
          },
        },
      },
    } as unknown as Asset);
    processMock.mockResolvedValueOnce({
      publish: publishMock,
    } as unknown as Asset);
  });

  describe('Fetch', () => {
    test('not implemented', async () => {
      await expect(assetsDataProvider.fetch(null)).rejects.toThrow();
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      await expect(assetsDataProvider.fetchById('123')).rejects.toThrow();
    });
  });

  describe('Create', () => {
    test('uploads, processes and publishes an asset', async () => {
      await assetsDataProvider.create({
        id: 'abc',
        title: 'test title',
        description: 'test description',
        content: Buffer.from('file buffer'),
        contentType: 'image/jpeg',
      });
      expect(environmentMock.createAssetFromFiles).toHaveBeenCalledWith({
        fields: {
          title: { 'en-US': 'test title' },
          description: { 'en-US': 'test description' },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'abc.jpeg',
              file: Buffer.from('file buffer'),
            },
          },
        },
      });
      expect(processMock).toHaveBeenCalled();
      expect(publishMock).toHaveBeenCalled();
    });

    test('uses custom filename if present', async () => {
      await assetsDataProvider.create({
        id: 'abc',
        filename: 'other-filename.pdf',
        title: 'test title',
        description: 'test description',
        content: Buffer.from('file buffer'),
        contentType: 'image/jpeg',
      });
      expect(environmentMock.createAssetFromFiles).toHaveBeenCalledWith({
        fields: {
          title: { 'en-US': 'test title' },
          description: { 'en-US': 'test description' },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'other-filename.pdf',
              file: Buffer.from('file buffer'),
            },
          },
        },
      });
      expect(processMock).toHaveBeenCalled();
      expect(publishMock).toHaveBeenCalled();
    });

    test('does not publish the asset publish option is set to false', async () => {
      await assetsDataProvider.create({
        id: 'abc',
        title: 'test title',
        description: 'test description',
        content: Buffer.from('file buffer'),
        contentType: 'image/jpeg',
        publish: false,
      });
      expect(environmentMock.createAssetFromFiles).toHaveBeenCalled();
      expect(processMock).toHaveBeenCalled();
      expect(publishMock).not.toHaveBeenCalled();
    });

    test('returns the asset id, url and filename', async () => {
      const asset = await assetsDataProvider.create({
        id: 'abc',
        title: 'test title',
        description: 'test description',
        content: Buffer.from('file buffer'),
        contentType: 'image/jpeg',
      });
      expect(asset).toEqual({
        id: '123',
        url: 'https://test-url',
        filename: 'abc.jpeg',
      });
    });

    test('should default to input filename and empty url if locale not present', async () => {
      environmentMock.createAssetFromFiles.mockReset();
      environmentMock.createAssetFromFiles.mockResolvedValueOnce({
        processForAllLocales: processMock,
        sys: {
          id: '123',
        },
        fields: {
          file: {},
        },
      } as unknown as Asset);

      const asset = await assetsDataProvider.create({
        id: '123',
        filename: 'other-filename.pdf',
        title: 'test title',
        description: 'test description',
        content: Buffer.from('file buffer'),
        contentType: 'application/pdf',
      });

      expect(asset).toEqual({
        id: '123',
        url: '',
        filename: 'other-filename.pdf',
      });
    });
  });
});
