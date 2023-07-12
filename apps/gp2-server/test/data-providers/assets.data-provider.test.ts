import { Asset, Environment } from '@asap-hub/contentful';
import { AssetContentfulDataProvider } from '../../src/data-providers/asset.data-provider';
import { AssetDataProvider } from '../../src/data-providers/types';
import { getContentfulEnvironmentMock } from '../mocks/contentful-rest-client.mock';

describe('Assets data provider', () => {
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const assetsDataProvider: AssetDataProvider = new AssetContentfulDataProvider(
    contentfulRestClientMock,
  );

  const processMock = jest.fn();
  const publishMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    environmentMock.createAssetFromFiles.mockResolvedValueOnce({
      processForAllLocales: processMock,
    } as unknown as Asset);
    processMock.mockResolvedValueOnce({
      publish: publishMock,
    } as unknown as Asset);
    publishMock.mockResolvedValueOnce({
      sys: {
        id: '123',
      },
    });
  });

  describe('Fetch', () => {
    test('not implemented', async () => {
      expect(async () => assetsDataProvider.fetch(null)).rejects.toThrow();
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      expect(async () => assetsDataProvider.fetchById('123')).rejects.toThrow();
    });
  });

  describe('Create', () => {
    test('uploads, processes and publishes an asset', async () => {
      await assetsDataProvider.create({
        id: 'abc',
        avatar: Buffer.from('file buffer'),
        contentType: 'image/jpeg',
      });
      expect(environmentMock.createAssetFromFiles).toHaveBeenCalledWith({
        fields: {
          title: { 'en-US': expect.any(String) },
          description: { 'en-US': expect.any(String) },
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
  });
});
