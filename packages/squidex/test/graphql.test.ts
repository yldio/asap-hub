import nock from 'nock';
import { gql } from 'graphql-request';
import { SquidexGraphql, SquidexGraphqlError } from '../src/graphql';
import { getAccessTokenMock } from './mocks/access-token.mock';

describe('Squidex Graphql Client', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  const appName = 'test-app';
  const baseUrl = 'http://test-url.com';
  const squidexGraphqlClient = new SquidexGraphql(getAccessTokenMock, {
    baseUrl,
    appName,
  });

  test('Should throw an error which contains the error message when the identity call fails', async () => {
    getAccessTokenMock.mockImplementationOnce(async () => {
      throw new Error('request error');
    });

    await expect(squidexGraphqlClient.request('{ id }')).rejects.toThrow(
      'request error',
    );
  });

  describe('with the auth token', () => {
    getAccessTokenMock.mockResolvedValue('some-token');

    test('returns data from the graphql query', async () => {
      nock(baseUrl)
        .post(
          `/api/content/${appName}/graphql`,
          JSON.stringify({ query: '{ id }' }),
        )
        .reply(200, {
          data: {
            id: 'id',
          },
        });

      const res = await squidexGraphqlClient.request('{ id }');
      expect(res).toEqual({ id: 'id' });
    });

    test('returns data when the content-type header is application/graphql+json', async () => {
      nock(baseUrl)
        .post(
          `/api/content/${appName}/graphql`,
          JSON.stringify({ query: '{ id }' }),
        )
        .reply(
          200,
          {
            data: {
              id: 'id',
            },
          },
          {
            'content-type': 'application/graphql+json',
          },
        );

      const res = await squidexGraphqlClient.request('{ id }');
      expect(res).toEqual({ id: 'id' });
    });

    test('adds the X-Unpublished header when drafts are requested', async () => {
      nock(baseUrl)
        .post(
          `/api/content/${appName}/graphql`,
          JSON.stringify({ query: '{ id }' }),
        )
        .matchHeader('X-Unpublished', `true`)
        .reply(200, {
          data: {
            id: 'id',
          },
        });

      const res = await squidexGraphqlClient.request('{ id }', undefined, {
        includeDrafts: true,
      });
      expect(res).toEqual({ id: 'id' });
    });

    test('Should throw an error which contains the error message and details when a graphql error is returned', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/graphql`)
        .reply(200, {
          errors: [
            {
              message:
                "OData $filter clause not valid: Could not find a property named 'adasdsa' on type 'AsapHubDev.teams'.",
              locations: [{ line: 3, column: 9 }],
              path: ['queryTeamsContents'],
            },
          ],
          data: { queryTeamsContents: null },
        });

      const query = gql`
        query {
          queryTeamsContents(filter: "adasdsa") {
            id
          }
        }
      `;
      const errorResponse = squidexGraphqlClient.request(query);
      await expect(errorResponse).rejects.toThrow(
        'OData $filter clause not valid',
      );
    });

    test('Should throw an error which contains the error message when an authorization error is returned', async () => {
      nock(baseUrl).post(`/api/content/${appName}/graphql`).reply(401, {
        message: 'Unauthorized',
        traceId: '00-ef3a78703657df92209a31f75966c076-51fb1930720a3780-01',
        type: 'https://tools.ietf.org/html/rfc7235#section-3.1',
        statusCode: 401,
      });

      await expect(squidexGraphqlClient.request('{ id }')).rejects.toThrow(
        'Unauthorized',
      );
    });

    test('Should throw an error which contains any other error message when a server-side error is returned', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/graphql`)
        .reply(521, 'some crazy error');

      await expect(squidexGraphqlClient.request('{ id }')).rejects.toThrow(
        'some crazy error',
      );
    });

    test('Should throw an instance of a specific Client error', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/graphql`)
        .reply(521, 'some crazy error');

      await expect(squidexGraphqlClient.request('{ id }')).rejects.toThrow(
        SquidexGraphqlError,
      );
    });
  });
});
