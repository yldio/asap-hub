import { config } from '@asap-hub/squidex';
import nock from 'nock';
import AssetDataProvider from '../../src/data-providers/assets.data-provider';
import { identity } from '../helpers/squidex';

describe('Asset data provider', () => {
  const assetDataProvider = new AssetDataProvider();
  beforeAll(() => {
    identity();
  });

  describe('create', () => {
    afterEach(nock.cleanAll);
    test('should return asset id when syncs asset', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' });

      const result = await assetDataProvider.create(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual('squidex-asset-id');
      expect(nock.isDone()).toBe(true);
    });
    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(500);

      await expect(
        assetDataProvider.create(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
      expect(nock.isDone()).toBe(true);
    });
  });
});
