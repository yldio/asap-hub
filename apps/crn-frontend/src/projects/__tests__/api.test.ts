import type { AlgoliaClient } from '@asap-hub/algolia';
import { BackendError } from '@asap-hub/frontend-utils';
import type {
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectResponse,
} from '@asap-hub/model';

import {
  createProjectMilestone,
  getAimArticles,
  getMilestoneArticles,
  getProject,
  getProjectMilestones,
  getProjects,
  isProjectMilestonesSyncComplete,
  MilestonesListOptions,
  patchProject,
  ProjectListOptions,
  putMilestoneArticles,
  toListProjectResponse,
  waitForMilestonesSync,
} from '../api';

jest.mock('../../config', () => ({
  API_BASE_URL: 'https://api.example.com',
}));

jest.mock('@asap-hub/frontend-utils', () => ({
  ...jest.requireActual('@asap-hub/frontend-utils'),
  wait: jest.fn().mockResolvedValue(undefined),
}));

describe('projects api', () => {
  const mockAlgoliaClient = {
    search: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaClient<'crn'>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    const options: ProjectListOptions = {
      projectType: 'Discovery Project',
      searchQuery: 'cell',
      currentPage: 2,
      pageSize: 15,
      filters: new Set<string>(),
      statusFilters: ['Active', 'Closed'],
      facetFilters: {
        researchTheme: ['Neuro'],
        resourceType: ['Dataset', 'Portal'],
      },
    };

    it('invokes Algolia search with composed filters and pagination', async () => {
      mockAlgoliaClient.search.mockResolvedValueOnce({
        nbHits: 0,
        hits: [],
        queryID: 'query-id',
        index: 'projects-index',
        facets: {},
      } as never);

      await getProjects(mockAlgoliaClient, options);

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        'cell',
        expect.objectContaining({
          page: 2,
          hitsPerPage: 15,
          filters:
            'projectType:"Discovery Project" AND (status:"Active" OR status:"Closed") AND researchTheme:"Neuro" AND (resourceType:"Dataset" OR resourceType:"Portal")',
        }),
      );
    });

    it('throws a descriptive error when Algolia rejects', async () => {
      mockAlgoliaClient.search.mockRejectedValueOnce(new Error('Invalid key'));

      await expect(getProjects(mockAlgoliaClient, options)).rejects.toThrow(
        'Could not search: Invalid key',
      );
    });

    it('omits facet filters when none are provided', async () => {
      mockAlgoliaClient.search.mockResolvedValueOnce({
        nbHits: 0,
        hits: [],
        queryID: 'query-id',
        index: 'projects-index',
        facets: {},
      } as never);

      await getProjects(mockAlgoliaClient, {
        projectType: 'Discovery Project',
        currentPage: 0,
        pageSize: 10,
        filters: new Set<string>(),
        searchQuery: '',
      });

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        '',
        expect.objectContaining({
          filters: 'projectType:"Discovery Project"',
        }),
      );
    });

    it('skips empty facet values when provided', async () => {
      mockAlgoliaClient.search.mockResolvedValueOnce({
        nbHits: 0,
        hits: [],
        queryID: 'query-id',
        index: 'projects-index',
        facets: {},
      } as never);

      await getProjects(mockAlgoliaClient, {
        projectType: 'Discovery Project',
        currentPage: 0,
        pageSize: 10,
        filters: new Set<string>(),
        searchQuery: '',
        facetFilters: { researchTheme: [] },
      });

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        '',
        expect.objectContaining({
          filters: 'projectType:"Discovery Project"',
        }),
      );
    });

    it('escapes facet filter values containing quotes', async () => {
      mockAlgoliaClient.search.mockResolvedValueOnce({
        nbHits: 0,
        hits: [],
        queryID: 'query-id',
        index: 'projects-index',
        facets: {},
      } as never);

      await getProjects(mockAlgoliaClient, {
        projectType: 'Discovery Project',
        currentPage: 0,
        pageSize: 10,
        filters: new Set<string>(),
        searchQuery: '',
        facetFilters: { researchTheme: ['Value "with quotes"'] },
      });

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        '',
        expect.objectContaining({
          filters: expect.stringContaining(
            'researchTheme:"Value \\"with quotes\\""',
          ),
        }),
      );
    });
  });

  describe('toListProjectResponse', () => {
    it('maps Algolia response to the list response shape', () => {
      const response = {
        nbHits: 2,
        hits: [{ id: '1' }, { id: '2' }],
        queryID: 'query-id',
        index: 'projects-index',
      } as never;

      expect(toListProjectResponse(response)).toEqual({
        total: 2,
        items: [{ id: '1' }, { id: '2' }],
        algoliaQueryId: 'query-id',
        algoliaIndexName: 'projects-index',
      });
    });
  });

  describe('patchProject', () => {
    const mockFetch = jest.fn();
    const patch = { tools: [{ name: 'Slack', url: 'https://slack.com' }] };

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('makes an authorized PATCH request and returns the updated project', async () => {
      const updated = { id: '1' } as ProjectDetail;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(updated),
      });

      const result = await patchProject('1', patch, 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/projects/1',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
          body: JSON.stringify(patch),
        }),
      );
      expect(result).toEqual(updated);
    });

    it('throws BackendError when the response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockResolvedValue({ message: 'boom' }),
      });

      await expect(patchProject('1', patch, 'Bearer token')).rejects.toThrow(
        'Failed to update project with id 1. Expected status 2xx. Received status 500 Server Error.',
      );
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockRejectedValue(new Error('parse failure')),
      });

      const promise = patchProject('1', patch, 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
    });
  });

  describe('getAimArticles', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns articles when the response is ok', async () => {
      const articles = [{ id: 'article-1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(articles),
      });

      const result = await getAimArticles('aim-1', 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/aims/aim-1/articles',
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
        }),
      );
      expect(result).toEqual(articles);
    });

    it('throws BackendError when the response is not ok', async () => {
      const errorBody = { message: 'not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue(errorBody),
      });

      const promise = getAimArticles('aim-1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: errorBody,
        statusCode: 404,
      });
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = getAimArticles('aim-1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('getProject', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns parsed project when the response is ok', async () => {
      const project = { id: '1' } as ProjectResponse;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(project),
      });

      const result = await getProject('1', 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/projects/1',
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
        }),
      );
      expect(result).toEqual(project);
    });

    it('returns undefined when the project is not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn(),
      });

      await expect(
        getProject('missing', 'Bearer token'),
      ).resolves.toBeUndefined();
    });

    it('throws BackendError when the response is not ok', async () => {
      const errorBody = { message: 'boom' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockResolvedValue(errorBody),
      });

      const promise = getProject('1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: errorBody,
        statusCode: 500,
      });
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = getProject('1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('getMilestoneArticles', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns articles when the response is ok', async () => {
      const articles = [{ id: 'article-1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(articles),
      });

      const result = await getMilestoneArticles('milestone-1', 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/milestones/milestone-1/articles',
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
        }),
      );
      expect(result).toEqual(articles);
    });

    it('throws BackendError when the response is not ok', async () => {
      const errorBody = { message: 'not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue(errorBody),
      });

      const promise = getMilestoneArticles('milestone-1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: errorBody,
        statusCode: 404,
      });
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = getMilestoneArticles('milestone-1', 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('putMilestoneArticles', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('makes a PUT request with the correct body', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await putMilestoneArticles(
        'milestone-1',
        ['ro-1', 'ro-2'],
        'Bearer token',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/milestones/milestone-1/articles',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            authorization: 'Bearer token',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({ articleIds: ['ro-1', 'ro-2'] }),
        }),
      );
    });

    it('makes a PUT request with an empty articleIds array', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await putMilestoneArticles('milestone-1', [], 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: JSON.stringify({ articleIds: [] }) }),
      );
    });

    it('throws BackendError when the response is not ok', async () => {
      const errorBody = { message: 'forbidden' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue(errorBody),
      });

      const promise = putMilestoneArticles(
        'milestone-1',
        ['ro-1'],
        'Bearer token',
      );

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: errorBody,
        statusCode: 403,
      });
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = putMilestoneArticles(
        'milestone-1',
        ['ro-1'],
        'Bearer token',
      );

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('getProjectMilestones', () => {
    const mockFetch = jest.fn();

    const options: MilestonesListOptions = {
      projectId: 'project-1',
      grantType: 'original',
      searchQuery: '',
      currentPage: 2,
      pageSize: 15,
      filters: new Set<string>(),
    };

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns project milestones when the response is ok', async () => {
      const projectMilestones = {
        total: 2,
        items: [
          {
            id: 'milestone-1',
            description: 'First milestone',
            articleCount: 4,
            aims: '1',
            status: 'Complete',
          },
          {
            id: 'milestone-2',
            description: 'Second milestone',
            articleCount: 2,
            aims: '2,5',
            status: 'In Progress',
          },
        ],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(projectMilestones),
      });

      const result = await getProjectMilestones(options, 'Bearer token');

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.example.com/projects/${options.projectId}/milestones?take=15&skip=30&grantType=original`,
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
        }),
      );
      expect(result).toEqual(projectMilestones);
    });

    it('includes search and filter params when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ total: 0, items: [] }),
      });

      await getProjectMilestones(
        {
          ...options,
          searchQuery: 'milestone description',
          filters: new Set(['Complete', 'Pending']),
        },
        'Bearer token',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/projects/project-1/milestones?search=milestone+description&take=15&skip=30&filter=Complete&filter=Pending&grantType=original',
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
        }),
      );
    });

    it('appends the sort query parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ total: 0, items: [] }),
      });

      await getProjectMilestones(
        { ...options, sort: 'aim_desc' },
        'Bearer token',
      );

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('sort=aim_desc');
    });

    it('omits the sort query parameter when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ total: 0, items: [] }),
      });

      await getProjectMilestones(options, 'Bearer token');

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).not.toContain('sort=');
    });

    it('throws BackendError when the response is not ok', async () => {
      const errorBody = { message: 'not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue(errorBody),
      });

      const promise = getProjectMilestones(options, 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: errorBody,
        statusCode: 404,
      });
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = getProjectMilestones(options, 'Bearer token');

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('createProjectMilestone', () => {
    const mockFetch = jest.fn();
    const milestoneData: MilestoneCreateRequest = {
      grantType: 'original',
      description: 'milestone description',
      aimIds: ['1', '3'],
      status: 'In Progress',
    };

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('makes an authorized POST request and returns the created milestone id', async () => {
      const created = { id: 'milestone-1' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(created),
      });

      const result = await createProjectMilestone(
        '1',
        milestoneData,
        'Bearer token',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/projects/1/milestones',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ authorization: 'Bearer token' }),
          body: JSON.stringify(milestoneData),
        }),
      );
      expect(result).toEqual(created);
    });

    it('throws BackendError when the response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockResolvedValue({ message: 'boom' }),
      });

      await expect(
        createProjectMilestone('1', milestoneData, 'Bearer token'),
      ).rejects.toThrow(
        'Failed to create milestone for project 1. Expected status 2xx. Received status 500 Server Error.',
      );
    });

    it('throws BackendError when the response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = createProjectMilestone(
        '1',
        milestoneData,
        'Bearer token',
      );

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        response: undefined,
        statusCode: 500,
      });
      expect(json).toHaveBeenCalled();
    });
  });

  describe('isProjectMilestonesSyncComplete', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns syncComplete when the response is ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ syncComplete: true }),
      });

      const result = await isProjectMilestonesSyncComplete(
        'project-1',
        'Bearer token',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/projects/project-1/milestones-sync-status',
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: 'Bearer token',
          }),
        }),
      );

      expect(result).toBe(true);
    });

    it('throws BackendError when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockResolvedValue({ message: 'boom' }),
      });

      await expect(
        isProjectMilestonesSyncComplete('project-1', 'Bearer token'),
      ).rejects.toThrow(
        'Failed to check milestones sync completion for project with id project-1. Expected status 2xx. Received status 500 Server Error.',
      );
    });

    it('throws BackendError when response body cannot be parsed', async () => {
      const json = jest.fn().mockRejectedValue(new Error('parse failure'));

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json,
      });

      const promise = isProjectMilestonesSyncComplete(
        'project-1',
        'Bearer token',
      );

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        statusCode: 500,
        response: undefined,
      });

      expect(json).toHaveBeenCalled();
    });
  });

  describe('waitForMilestonesSync', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('returns true when sync is stable for 2 consecutive checks', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        });

      const result = await waitForMilestonesSync('project-1', 'Bearer token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('resets stability when sync becomes false', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: false }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        });

      const result = await waitForMilestonesSync('project-1', 'Bearer token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('returns false after 10 unsuccessful attempts', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ syncComplete: false }),
      });

      const result = await waitForMilestonesSync('project-1', 'Bearer token');

      expect(result).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(10);
    });

    it('continues polling even if a request fails', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ syncComplete: true }),
        });

      const result = await waitForMilestonesSync('project-1', 'Bearer token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });
});
