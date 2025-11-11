import type { AlgoliaClient } from '@asap-hub/algolia';
import { BackendError } from '@asap-hub/frontend-utils';
import type { ProjectResponse } from '@asap-hub/model';

import {
  getProject,
  getProjectFacets,
  getProjects,
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
      projectType: 'Discovery',
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
            'projectType:"Discovery" AND (status:"Active" OR status:"Closed") AND researchTheme:"Neuro" AND (resourceType:"Dataset" OR resourceType:"Portal")',
          facets: ['status', 'researchTheme', 'resourceType'],
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
        projectType: 'Discovery',
        currentPage: 0,
        pageSize: 10,
        filters: new Set<string>(),
        searchQuery: '',
      });

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        '',
        expect.objectContaining({
          filters: 'projectType:"Discovery"',
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
        projectType: 'Discovery',
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
          filters: 'projectType:"Discovery"',
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
        projectType: 'Discovery',
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

  describe('getProjectFacets', () => {
    it('requests facet counts with hitsPerPage=0', async () => {
      const facetsResponse = {
        researchTheme: { Neuro: 3 },
      };

      mockAlgoliaClient.search.mockResolvedValueOnce({
        facets: facetsResponse,
      } as never);

      const result = await getProjectFacets(mockAlgoliaClient, {
        projectType: 'Resource',
        facets: ['resourceType'],
      });

      expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
        ['project'],
        '',
        expect.objectContaining({
          page: 0,
          hitsPerPage: 0,
          filters: 'projectType:"Resource"',
          facets: ['resourceType'],
        }),
      );
      expect(result).toEqual(facetsResponse);
    });

    it('wraps Algolia errors with a helpful message', async () => {
      mockAlgoliaClient.search.mockRejectedValueOnce(new Error('Invalid key'));

      await expect(
        getProjectFacets(mockAlgoliaClient, {
          projectType: 'Discovery',
          facets: ['researchTheme'],
        }),
      ).rejects.toThrow('Could not fetch project facets: Invalid key');
    });
  });

  describe('toListProjectResponse', () => {
    it('maps Algolia response to the list response shape', () => {
      const response = {
        nbHits: 2,
        hits: [{ id: '1' }, { id: '2' }],
        queryID: 'query-id',
        index: 'projects-index',
        facets: { researchTheme: { Neuro: 1 } },
      } as never;

      expect(toListProjectResponse(response)).toEqual({
        total: 2,
        items: [{ id: '1' }, { id: '2' }],
        algoliaQueryId: 'query-id',
        algoliaIndexName: 'projects-index',
        facets: { researchTheme: { Neuro: 1 } },
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
});
