import { Environment, Asset } from '@asap-hub/contentful';
import { AssetDataProvider } from '../../../src/data-providers/assets.data-provider';
import { AssetContentfulDataProvider } from '../../../src/data-providers/contentful/assets.data-provider';
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

  beforeEach(() => {
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Create', () => {
    test('uploads, processes and publishes an asset', async () => {
      await assetsDataProvider.create(
        'abc',
        Buffer.from('file buffer'),
        'image/jpeg',
      );
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
