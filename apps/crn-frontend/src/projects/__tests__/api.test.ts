import type { AlgoliaClient } from '@asap-hub/algolia';
import { BackendError } from '@asap-hub/frontend-utils';
import type {
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectResponse,
} from '@asap-hub/model';

import {
  createMilestone,
  getProject,
  getProjects,
  patchProject,
  ProjectListOptions,
  toListProjectResponse,
} from '../api';

jest.mock('../../config', () => ({
  API_BASE_URL: 'https://api.example.com',
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
        'https://api.example.com/project/1',
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
        'https://api.example.com/project/1',
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

  describe('createMilestone', () => {
    const mockFetch = jest.fn();
    const milestoneData: MilestoneCreateRequest = {
      grantType: 'original',
      description: 'First milestone',
      status: 'Pending',
      aimIds: ['aim-1'],
    };

    beforeEach(() => {
      (global as unknown as { fetch: typeof fetch }).fetch = mockFetch as never;
    });

    it('makes POST request with correct body', async () => {
      const created = { id: 'milestone-1' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(created),
      });

      const result = await createMilestone(
        'project-1',
        milestoneData,
        'Bearer token',
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/project/project-1/milestones',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(milestoneData),
        }),
      );
      expect(result).toEqual(created);
    });

    it('sends authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'milestone-1' }),
      });

      await createMilestone('project-1', milestoneData, 'Bearer my-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: 'Bearer my-token',
            'content-type': 'application/json',
          }),
        }),
      );
    });

    it('throws BackendError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({ message: 'not allowed' }),
      });

      const promise = createMilestone(
        'project-1',
        milestoneData,
        'Bearer token',
      );

      await expect(promise).rejects.toThrow(BackendError);
      await expect(promise).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });
});
