import { RestUser, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import AssetDataProvider from '../../src/data-providers/assets.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { identity } from '../helpers/squidex';

describe('Asset data provider', () => {
  const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
  const assetDataProvider = new AssetDataProvider(userRestClient);
  beforeAll(() => {
    identity();
  });

  describe('create', () => {
    afterEach(nock.cleanAll);
    test('should return asset id when syncs asset', async () => {
      nock(baseUrl)
        .post(`/api/apps/${appName}/assets`)
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
      nock(baseUrl).post(`/api/apps/${appName}/assets`).reply(500);

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
