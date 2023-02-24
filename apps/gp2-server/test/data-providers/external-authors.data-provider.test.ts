import { GenericError } from '@asap-hub/errors';
import { RestExternalAuthor, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import { ExternalAuthorSquidexDataProvider } from '../../src/data-providers/external-authors.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { getExternalAuthorCreateDataObject } from '../fixtures/external-authors.fixtures';
import { identity } from '../helpers/squidex';

describe('External Authors data provider', () => {
  const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    { appName, baseUrl },
  );
  const externalAuthorsDataProvider = new ExternalAuthorSquidexDataProvider(
    externalAuthorRestClient,
  );

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create method', () => {
    test('Should create an external author', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: { iv: externalAuthorCreateDataObject.orcid },
        })
        .reply(200, { id: 'author-1' });

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );
      expect(result).toEqual('author-1');
    });

    test('Should create an external author without ORCID', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();
      delete externalAuthorCreateDataObject.orcid;

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: undefined,
        })
        .reply(200, { id: 'author-1' });

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );
      expect(result).toEqual('author-1');
    });

    test('Should throw when fails to create the external author - 500', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: undefined,
        })
        .reply(500);

      await expect(
        externalAuthorsDataProvider.create(externalAuthorCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });
});
