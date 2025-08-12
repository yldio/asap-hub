import supertest from 'supertest';
import { appFactory } from '../../src/app';
import OpenSearchController from '../../src/controllers/opensearch.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/opensearch/ route', () => {
  const opensearchControllerMock = {
    search: jest.fn(),
  } as unknown as jest.Mocked<OpenSearchController>;

  const app = appFactory({
    opensearchController: opensearchControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  const mockSearchResponse = {
    took: 2,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 3,
        relation: 'eq' as const,
      },
      max_score: 1.2,
      hits: [
        {
          _index: 'os-champion-test',
          _id: 'team-1',
          _score: 1.2,
          _source: {
            teamId: 'team-123',
            teamName: 'Alpha Team',
            isTeamInactive: false,
            teamAwardsCount: 2,
            users: [
              {
                id: 'user-1',
                name: 'John Doe',
                awardsCount: 1,
              },
            ],
          },
        },
      ],
    },
  };

  afterEach(() => {
    opensearchControllerMock.search.mockReset();
  });

  describe('POST /opensearch/search/:index', () => {
    const validSearchBody = {
      query: {
        match: {
          teamName: 'alpha',
        },
      },
      size: 10,
      from: 0,
    };

    it('should return 200 when search is successful', async () => {
      opensearchControllerMock.search.mockResolvedValueOnce(mockSearchResponse);

      const response = await supertest(app)
        .post('/opensearch/search/os-champion')
        .send(validSearchBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSearchResponse);
      expect(opensearchControllerMock.search).toHaveBeenCalledWith(
        'os-champion',
        validSearchBody,
        expect.any(Object), // loggedInUser
      );
    });

    it('should return 200 with empty results when no matches found', async () => {
      const emptyResponse = {
        took: 1,
        timed_out: false,
        _shards: {
          total: 1,
          successful: 1,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: {
            value: 0,
            relation: 'eq' as const,
          },
          max_score: undefined,
          hits: [],
        },
      };

      opensearchControllerMock.search.mockResolvedValueOnce(emptyResponse);

      const response = await supertest(app)
        .post('/opensearch/search/os-champion')
        .send(validSearchBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyResponse);
    });

    it('should handle empty request body', async () => {
      opensearchControllerMock.search.mockResolvedValueOnce(mockSearchResponse);

      const response = await supertest(app)
        .post('/opensearch/search/os-champion')
        .send({});

      expect(response.status).toBe(200);
      expect(opensearchControllerMock.search).toHaveBeenCalledWith(
        'os-champion',
        {},
        expect.any(Object),
      );
    });

    it('should return 500 when controller throws error', async () => {
      opensearchControllerMock.search.mockRejectedValueOnce(
        new Error('OpenSearch service unavailable'),
      );

      const response = await supertest(app)
        .post('/opensearch/search/os-champion')
        .send(validSearchBody);

      expect(response.status).toBe(500);
    });

    it('should work with different index names', async () => {
      opensearchControllerMock.search.mockResolvedValueOnce(mockSearchResponse);

      const response = await supertest(app)
        .post('/opensearch/search/other-index')
        .send(validSearchBody);

      expect(response.status).toBe(200);
      expect(opensearchControllerMock.search).toHaveBeenCalledWith(
        'other-index',
        validSearchBody,
        expect.any(Object),
      );
    });
  });
});
