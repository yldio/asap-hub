import { GenericError } from '@asap-hub/errors';
import { gp2 as gp2Squidex, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import { ExternalUserSquidexDataProvider } from '../../src/data-providers/external-users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { getExternalUserCreateDataObject } from '../fixtures/external-users.fixtures';
import { identity } from '../helpers/squidex';

describe('External Users data provider', () => {
  const externalUserRestClient = new SquidexRest<gp2Squidex.RestExternalUser>(
    getAuthToken,
    'external-users',
    { appName, baseUrl },
  );
  const externalUsersDataProvider = new ExternalUserSquidexDataProvider(
    externalUserRestClient,
  );

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create method', () => {
    test('Should create an external user', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: { iv: externalUserCreateDataObject.orcid },
        })
        .reply(200, { id: 'user-1' });

      const result = await externalUsersDataProvider.create(
        externalUserCreateDataObject,
      );
      expect(result).toEqual('user-1');
    });

    test('Should create an external user without ORCID', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();
      delete externalUserCreateDataObject.orcid;

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: undefined,
        })
        .reply(200, { id: 'user-1' });

      const result = await externalUsersDataProvider.create(
        externalUserCreateDataObject,
      );
      expect(result).toEqual('user-1');
    });

    test('Should throw when fails to create the external user - 500', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: undefined,
        })
        .reply(500);

      await expect(
        externalUsersDataProvider.create(externalUserCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });
});
