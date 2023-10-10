import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { PAGE_SIZE } from '../../hooks';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { createOutput, getOutput, getOutputs, updateOutput } from '../api';

jest.mock('../../config');

describe('getOutput', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched output by id', async () => {
    const outputResponse = gp2Fixtures.createOutputResponse();
    const { id } = outputResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/${id}`)
      .reply(200, outputResponse);
    const result = await getOutput(id, 'Bearer x');
    expect(result).toEqual(outputResponse);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/unknown-id`)
      .reply(404);
    const result = await getOutput('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/unknown-id`)
      .reply(500);

    await expect(
      getOutput('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch output with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getOutputs', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest
      .fn()
      .mockResolvedValue(createOutputListAlgoliaResponse(10));
  });

  const options: GetListOptions = {
    filters: new Set<string>(),
    pageSize: PAGE_SIZE,
    currentPage: 0,
    searchQuery: '',
  };

  it('makes a search request with query, default page and page size', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });
  it('passes page number and page size to request', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });
  it('builds a single filter query', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article']),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article")',
      }),
    );
  });

  it('builds a multiple filter query', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article', 'GP2 Reports']),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"GP2 Reports" OR documentType:"Article")',
      }),
    );
  });

  it('ignores unknown filters', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType | 'invalid'>([
        'Article',
        'invalid',
      ]),
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article")',
      }),
    );
  });

  it('uses project as a filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      projectId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: 'project.id:"12345"',
      }),
    );
  });

  it('adds project to documentType filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article']),
      projectId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article") AND project.id:"12345"',
      }),
    );
  });

  it('adds project to documentType filters', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article', 'GP2 Reports']),
      projectId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters:
          '(documentType:"GP2 Reports" OR documentType:"Article") AND project.id:"12345"',
      }),
    );
  });
  it('uses workingGroup as a filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      workingGroupId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: 'workingGroup.id:"12345"',
      }),
    );
  });

  it('adds workingGroup to documentType filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article']),
      workingGroupId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article") AND workingGroup.id:"12345"',
      }),
    );
  });

  it('adds workingGroup to documentType filters', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article', 'GP2 Reports']),
      workingGroupId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters:
          '(documentType:"GP2 Reports" OR documentType:"Article") AND workingGroup.id:"12345"',
      }),
    );
  });
  it('uses author as a filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      authorId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: 'authors.id:"12345"',
      }),
    );
  });

  it('adds author to documentType filter', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article']),
      authorId: '12345',
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters: '(documentType:"Article") AND authors.id:"12345"',
      }),
    );
  });

  it('adds author to documentType filters', async () => {
    await getOutputs(mockAlgoliaSearchClient, {
      ...options,
      filters: new Set<gp2Model.OutputDocumentType>(['Article', 'GP2 Reports']),
      authorId: '12345',
    });
    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['output'],
      '',
      expect.objectContaining({
        filters:
          '(documentType:"GP2 Reports" OR documentType:"Article") AND authors.id:"12345"',
      }),
    );
  });
  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getOutputs(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});

describe('createOutput', () => {
  const payload = {
    title: 'output title',
    documentType: 'Procedural Form' as const,
    sharingStatus: 'GP2 Only' as gp2Model.OutputSharingStatus,
    mainEntityId: 'id-1',
    tagIds: [],
    contributingCohortIds: [],
    relatedOutputIds: [],
    relatedEventIds: [],
  };
  it('makes an authorized POST request to create a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/outputs', payload)
      .reply(201, { id: 123 });

    await createOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/outputs').reply(500, {});

    await expect(
      createOutput(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create output. Expected status 201. Received status 500."`,
    );
  });
});

describe('updateOutput', () => {
  const outputResponse = gp2Fixtures.createOutputResponse();
  const { id } = outputResponse;
  const payload = {
    title: 'output title',
    documentType: 'Procedural Form' as const,
    sharingStatus: 'GP2 Only' as gp2Model.OutputSharingStatus,
    mainEntityId: 'id-1',
    tagIds: [],
    contributingCohortIds: [],
    relatedOutputIds: [],
    relatedEventIds: [],
  };
  it('makes an authorized POST request to update a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .put(`/outputs/${id}`, payload)
      .reply(201, { id: 123 });

    await updateOutput(id, payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });
  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .put(`/outputs/unknown-id`)
      .reply(404);
    const result = await updateOutput('unknown-id', payload, 'Bearer x');
    expect(result).toBeUndefined();
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).put(`/outputs/${id}`).reply(500, {});

    await expect(
      updateOutput(id, payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update output ro0. Expected status 200. Received status 500."`,
    );
  });
});
