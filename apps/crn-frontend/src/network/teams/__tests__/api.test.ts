import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  createAlgoliaResponse,
} from '@asap-hub/algolia';
import {
  createDiscussionResponse,
  createListLabsResponse,
  createListTeamResponse,
  createManuscriptResponse,
  createMessage,
  createPartialManuscriptResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  CompletedStatusOption,
  ComplianceReportPostRequest,
  DiscussionCreateRequest,
  DiscussionDataObject,
  DiscussionResponse,
  ManuscriptFileResponse,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  RequestedAPCCoverageOption,
  ResearchOutputPostRequest,
  TeamResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  createDiscussion,
  createComplianceReport,
  createManuscript,
  createResearchOutput,
  getDiscussion,
  getLabs,
  getManuscript,
  getManuscripts,
  getPresignedUrl,
  getTeam,
  getTeams,
  patchTeam,
  resubmitManuscript,
  updateDiscussion,
  updateManuscript,
  updateTeamResearchOutput,
  uploadManuscriptFile,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';

jest.mock('../../../config', () => ({
  API_BASE_URL: 'http://api',
}));

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getTeams', () => {
  it('makes an authorized GET request for teams', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getTeams(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched teams', async () => {
    const teams = createListTeamResponse(1);
    nock(API_BASE_URL)
      .get('/teams')
      .query({ take: '10', skip: '0' })
      .reply(200, teams);
    expect(await getTeams(options, '')).toEqual(teams);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/teams')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getTeams(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getTeam', () => {
  it('makes an authorized GET request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams/42')
      .reply(200, {});
    await getTeam('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched team', async () => {
    const team = createTeamResponse();
    nock(API_BASE_URL).get('/teams/42').reply(200, team);
    expect(await getTeam('42', '')).toEqual(team);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/teams/42').reply(404);
    expect(await getTeam('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/teams/42').reply(500);
    await expect(getTeam('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('patchTeam', () => {
  const patch = {
    tools: [
      {
        url: 'https://example.com/tool',
        name: 'Example Tool',
        description: 'Example Tool',
      },
    ],
  };
  it('makes an authorized PATCH request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .patch('/teams/42')
      .reply(200, {});

    await patchTeam('42', patch, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('passes the patch object in the body', async () => {
    nock(API_BASE_URL).patch('/teams/42', patch).reply(200, {});

    await patchTeam('42', patch, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully updated team', async () => {
    const updated: Partial<TeamResponse> = {
      projectTitle: 'Team Project',
      tools: patch.tools,
    };
    nock(API_BASE_URL).patch('/teams/42', patch).reply(200, updated);

    expect(await patchTeam('42', patch, '')).toEqual(updated);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).patch('/teams/42', patch).reply(500, {});

    await expect(
      patchTeam('42', patch, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update team with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});
describe('Team Research Output', () => {
  const payload: ResearchOutputPostRequest = {
    teams: ['90210'],
    documentType: 'Bioinformatics',
    link: 'http://a-link',
    title: 'A title',
    asapFunded: false,
    usedInPublication: false,
    sharingStatus: 'Public',
    publishDate: undefined,
    description: '',
    descriptionMD: '',
    shortDescription: '',
    type: 'Software',
    labs: ['lab1'],
    methods: [],
    keywords: [],
    organisms: [],
    environments: [],
    workingGroups: [],
    relatedResearch: [],
    relatedEvents: [],
    published: true,
  };
  it('makes an authorized POST request to create a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/research-outputs', payload)
      .reply(201, { id: 123 });

    await createResearchOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('makes an authorized POST request to create a draft research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/research-outputs', payload)
      .reply(201, { id: 123 });

    await createResearchOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('makes an authorized PUT request to update a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .put('/research-outputs/123', payload)
      .reply(200, { id: 123 });

    await updateTeamResearchOutput('123', payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('makes an authorized PUT request to update and publish a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .put('/research-outputs/123', payload)
      .reply(200, { id: 123 });

    await updateTeamResearchOutput('123', payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/research-outputs').reply(500, {});

    await expect(
      createResearchOutput(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create research output for Team. Expected status 201. Received status 500."`,
    );
  });

  it('errors for an error status in edit mode', async () => {
    nock(API_BASE_URL).put('/research-outputs/123').reply(500, {});

    await expect(
      updateTeamResearchOutput('123', payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update research output for teams 90210 Expected status 200. Received status 500."`,
    );
  });
});
describe('getLabs', () => {
  it('makes an authorized GET request for labs', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/labs')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getLabs(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched labs', async () => {
    const labs = createListLabsResponse(1);
    nock(API_BASE_URL)
      .get('/labs')
      .query({ take: '10', skip: '0' })
      .reply(200, labs);
    expect(await getLabs(options, '')).toEqual(labs);
  });
  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/labs').query({ take: '10', skip: '0' }).reply(500);
    await expect(
      getLabs(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch labs. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('Manuscript', () => {
  describe('POST', () => {
    const payload: ManuscriptPostRequest = {
      title: 'The Manuscript',
      teamId: '42',
      eligibilityReasons: [],
      versions: [
        {
          lifecycle: 'Publication',
          type: 'Original Research',
          manuscriptFile: {
            id: '42',
            filename: 'test-file',
            url: 'https://example.com/test-file',
          },
          teams: ['42'],
          labs: [],
          description: '',
          firstAuthors: [],
        },
      ],
    };
    it('makes an authorized POST request to create a manuscript', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/manuscripts', payload)
        .reply(201, { id: 123 });

      await createManuscript(payload, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL).post('/manuscripts').reply(500, {});

      await expect(
        createManuscript(payload, 'Bearer x'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to create manuscript. Expected status 201. Received status 500."`,
      );
    });
  });

  describe('PUT', () => {
    const manuscriptId = 'manuscript-1';
    const payload: ManuscriptPutRequest = {
      status: 'Addendum Required',
    };
    it('makes an authorized PUT request to update a manuscript', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .put(`/manuscripts/${manuscriptId}`, payload)
        .reply(200, createManuscriptResponse());

      await updateManuscript(manuscriptId, payload, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL).put(`/manuscripts/${manuscriptId}`).reply(500, {});

      await expect(
        updateManuscript(manuscriptId, payload, 'Bearer x'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to update manuscript with id manuscript-1. Expected status 200. Received status 500."`,
      );
    });
  });

  describe('GET', () => {
    it('makes an authorized GET request for the manuscript id', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .get('/manuscripts/42')
        .reply(200, {});
      await getManuscript('42', 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('returns a successfully fetched manuscript', async () => {
      const manuscript = createManuscriptResponse();
      nock(API_BASE_URL).get('/manuscripts/42').reply(200, manuscript);
      expect(await getManuscript('42', '')).toEqual(manuscript);
    });

    it('returns undefined for a 404', async () => {
      nock(API_BASE_URL).get('/manuscripts/42').reply(404);
      expect(await getManuscript('42', '')).toBe(undefined);
    });

    it('errors for another status', async () => {
      nock(API_BASE_URL).get('/manuscripts/42').reply(500);
      await expect(
        getManuscript('42', ''),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to fetch manuscript with id 42. Expected status 2xx or 404. Received status 500."`,
      );
    });
  });

  describe('getManuscripts', () => {
    type Search = () => Promise<ClientSearchResponse<'crn', 'manuscript'>>;
    const search: jest.MockedFunction<Search> = jest.fn();
    const algoliaSearchClient = {
      search,
    } as unknown as AlgoliaSearchClient<'crn'>;

    const algoliaManuscriptResponse = createPartialManuscriptResponse();

    beforeEach(() => {
      search.mockReset();
      search.mockResolvedValue(
        createAlgoliaResponse<'crn', 'manuscript'>([
          {
            ...algoliaManuscriptResponse,
            objectID: algoliaManuscriptResponse.id,
            __meta: { type: 'manuscript' },
          },
        ]),
      );
    });

    it('should return successfully fetched manuscripts', async () => {
      const workingGroups = await getManuscripts(algoliaSearchClient, {
        searchQuery: '',
        pageSize: null,
        currentPage: null,
        requestedAPCCoverage: 'all',
        completedStatus: 'show',
        selectedStatuses: [],
      });
      expect(workingGroups).toEqual(
        expect.objectContaining({
          items: [
            {
              ...algoliaManuscriptResponse,
              __meta: { type: 'manuscript' },
              objectID: algoliaManuscriptResponse.id,
            },
          ],
          total: 1,
        }),
      );
    });

    describe('filter combinations', () => {
      it.each([
        {
          requestedAPCCoverage: 'all',
          completedStatus: 'show',
          expectedFilter: '',
        },
        {
          requestedAPCCoverage: 'submitted',
          completedStatus: 'show',
          expectedFilter: 'requestingApcCoverage:"Already Submitted"',
        },
        {
          requestedAPCCoverage: 'yes',
          completedStatus: 'show',
          expectedFilter: 'requestingApcCoverage:Yes',
        },
        {
          requestedAPCCoverage: 'no',
          completedStatus: 'show',
          expectedFilter: 'requestingApcCoverage:No',
        },
        {
          requestedAPCCoverage: 'all',
          completedStatus: 'hide',
          expectedFilter:
            '(NOT status:Compliant AND NOT status:"Closed (other)")',
        },
        {
          requestedAPCCoverage: 'submitted',
          completedStatus: 'hide',
          expectedFilter:
            'requestingApcCoverage:"Already Submitted" AND (NOT status:Compliant AND NOT status:"Closed (other)")',
        },
        {
          requestedAPCCoverage: 'yes',
          completedStatus: 'hide',
          expectedFilter:
            'requestingApcCoverage:Yes AND (NOT status:Compliant AND NOT status:"Closed (other)")',
        },
        {
          requestedAPCCoverage: 'no',
          completedStatus: 'hide',
          expectedFilter:
            'requestingApcCoverage:No AND (NOT status:Compliant AND NOT status:"Closed (other)")',
        },
      ])(
        'should generate correct filter for requestedAPCCoverage=$requestedAPCCoverage and completedStatus=$completedStatus',
        async ({ requestedAPCCoverage, completedStatus, expectedFilter }) => {
          await getManuscripts(algoliaSearchClient, {
            searchQuery: '',
            pageSize: null,
            currentPage: null,
            requestedAPCCoverage:
              requestedAPCCoverage as RequestedAPCCoverageOption,
            completedStatus: completedStatus as CompletedStatusOption,
            selectedStatuses: [],
          });

          expect(search).toHaveBeenCalledWith(
            ['manuscript'],
            '',
            expect.objectContaining({
              filters: expectedFilter,
            }),
          );
        },
      );
    });

    it('should pass through search query', async () => {
      await getManuscripts(algoliaSearchClient, {
        searchQuery: 'test query',
        pageSize: null,
        currentPage: null,
        requestedAPCCoverage: 'all',
        completedStatus: 'show',
        selectedStatuses: [],
      });

      expect(search).toHaveBeenCalledWith(
        ['manuscript'],
        'test query',
        expect.any(Object),
      );
    });

    it('should pass through pagination parameters', async () => {
      await getManuscripts(algoliaSearchClient, {
        searchQuery: '',
        pageSize: 25,
        currentPage: 2,
        requestedAPCCoverage: 'all',
        completedStatus: 'show',
        selectedStatuses: [],
      });

      expect(search).toHaveBeenCalledWith(
        ['manuscript'],
        '',
        expect.objectContaining({
          hitsPerPage: 25,
          page: 2,
        }),
      );
    });

    describe('status filters', () => {
      it('should generate correct filter for single status', async () => {
        await getManuscripts(algoliaSearchClient, {
          searchQuery: '',
          pageSize: null,
          currentPage: null,
          requestedAPCCoverage: 'all',
          completedStatus: 'show',
          selectedStatuses: ['Waiting for Report'],
        });

        expect(search).toHaveBeenCalledWith(
          ['manuscript'],
          '',
          expect.objectContaining({
            filters: '(status:"Waiting for Report")',
          }),
        );
      });

      it('should generate correct filter for multiple statuses', async () => {
        await getManuscripts(algoliaSearchClient, {
          searchQuery: '',
          pageSize: null,
          currentPage: null,
          requestedAPCCoverage: 'all',
          completedStatus: 'show',
          selectedStatuses: ['Waiting for Report', 'Review Compliance Report'],
        });

        expect(search).toHaveBeenCalledWith(
          ['manuscript'],
          '',
          expect.objectContaining({
            filters:
              '(status:"Waiting for Report" OR status:"Review Compliance Report")',
          }),
        );
      });

      it('should combine status filters with APC coverage filter', async () => {
        await getManuscripts(algoliaSearchClient, {
          searchQuery: '',
          pageSize: null,
          currentPage: null,
          requestedAPCCoverage: 'yes',
          completedStatus: 'show',
          selectedStatuses: ['Waiting for Report', 'Compliant'],
        });

        expect(search).toHaveBeenCalledWith(
          ['manuscript'],
          '',
          expect.objectContaining({
            filters:
              'requestingApcCoverage:Yes AND (status:"Waiting for Report" OR status:"Compliant")',
          }),
        );
      });

      it('should combine status filters with completed status filter', async () => {
        await getManuscripts(algoliaSearchClient, {
          searchQuery: '',
          pageSize: null,
          currentPage: null,
          requestedAPCCoverage: 'all',
          completedStatus: 'hide',
          selectedStatuses: ['Waiting for Report', 'Review Compliance Report'],
        });

        expect(search).toHaveBeenCalledWith(
          ['manuscript'],
          '',
          expect.objectContaining({
            filters:
              '(NOT status:Compliant AND NOT status:"Closed (other)") AND (status:"Waiting for Report" OR status:"Review Compliance Report")',
          }),
        );
      });

      it('should combine status filters with both APC coverage and completed status filters', async () => {
        await getManuscripts(algoliaSearchClient, {
          searchQuery: '',
          pageSize: null,
          currentPage: null,
          requestedAPCCoverage: 'yes',
          completedStatus: 'hide',
          selectedStatuses: ['Waiting for Report', 'Review Compliance Report'],
        });

        expect(search).toHaveBeenCalledWith(
          ['manuscript'],
          '',
          expect.objectContaining({
            filters:
              'requestingApcCoverage:Yes AND (NOT status:Compliant AND NOT status:"Closed (other)") AND (status:"Waiting for Report" OR status:"Review Compliance Report")',
          }),
        );
      });
    });
  });

  describe('uploadManuscriptFile', () => {
    // nock does not deal well with actual files so we use this as a mock instead
    const file = 'test-file' as unknown as File;
    const mockResponse: ManuscriptFileResponse = {
      id: '42',
      filename: 'test-file',
      url: 'https://example.com/test-file',
    };

    afterEach(() => {
      nock.cleanAll();
    });

    it('makes an authorized POST request', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/manuscripts/file-upload')
        .reply(200, {});

      await uploadManuscriptFile(
        file,
        'Manuscript File',
        'Bearer x',
        jest.fn(),
      );
      expect(nock.isDone()).toBe(true);
    });

    it('passes the object in the body', async () => {
      nock(API_BASE_URL)
        .post('/manuscripts/file-upload', (body) => {
          if (typeof body === 'string' && body.includes('test-file')) {
            return true;
          }
          return false;
        })
        .reply(200, {});

      await uploadManuscriptFile(
        file,
        'Manuscript File',
        'Bearer x',
        jest.fn(),
      );
      expect(nock.isDone()).toBe(true);
    });

    it('returns a successfully uploaded file data', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/manuscripts/file-upload')
        .reply(200, mockResponse);

      const response = await uploadManuscriptFile(
        file,
        'Manuscript File',
        'Bearer x',
        jest.fn(),
      );
      expect(response).toEqual(mockResponse);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/manuscripts/file-upload')
        .reply(500, {});

      await expect(
        uploadManuscriptFile(file, 'Manuscript File', 'Bearer x', jest.fn()),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to upload manuscript file. Expected status 2xx. Received status 500."`,
      );
    });

    it('invokes handleError with the error message when a 400 error occurs', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/manuscripts/file-upload')
        .reply(400, {
          message: 'Validation Error',
        });

      const handleErrorMock = jest.fn();
      await uploadManuscriptFile(
        file,
        'Manuscript File',
        'Bearer x',
        handleErrorMock,
      );

      expect(handleErrorMock).toHaveBeenCalledWith('Validation Error');
    });
  });

  describe('resubmitManuscript', () => {
    const payload: ManuscriptPostRequest = {
      title: 'The Manuscript',
      teamId: '42',
      versions: [
        {
          lifecycle: 'Publication',
          type: 'Original Research',
          manuscriptFile: {
            id: '42',
            filename: 'test-file',
            url: 'https://example.com/test-file',
          },
          teams: ['42'],
          labs: [],
          description: '',
          firstAuthors: [],
        },
      ],
    };
    const manuscriptId = 'manuscript-id-1';

    it('makes an authorized POST request to resubmit a manuscript', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post(`/manuscripts/${manuscriptId}`, payload)
        .reply(201, { id: manuscriptId });

      await resubmitManuscript(manuscriptId, payload, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL).post(`/manuscripts/${manuscriptId}`).reply(500, {});

      await expect(
        resubmitManuscript(manuscriptId, payload, 'Bearer x'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to resubmit manuscript with id manuscript-id-1. Expected status 201. Received status 500."`,
      );
    });
  });
});

describe('Compliance Report', () => {
  describe('POST', () => {
    const payload: ComplianceReportPostRequest = {
      manuscriptId: 'manuscript-1',
      url: 'https://compliancereport.com',
      description: 'Compliance report description',
      manuscriptVersionId: 'manuscript-version-1',
      status: 'Review Compliance Report',
    };

    it('makes an authorized POST request to create a compliance report', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/compliance-reports', payload)
        .reply(201, { id: 123 });

      await createComplianceReport(payload, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL).post('/compliance-reports').reply(500, {});

      await expect(
        createComplianceReport(payload, 'Bearer x'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to create compliance report. Expected status 201. Received status 500."`,
      );
    });
  });
});

describe('Discussion', () => {
  describe('getDiscussion', () => {
    it('makes an authorized GET request for the discussion id', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .get('/discussions/42')
        .reply(200, {});
      await getDiscussion('42', 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('returns a successfully fetched discussion', async () => {
      const discussion = createDiscussionResponse();
      nock(API_BASE_URL).get('/discussions/42').reply(200, discussion);
      expect(await getDiscussion('42', '')).toEqual(discussion);
    });

    it('returns undefined for a 404', async () => {
      nock(API_BASE_URL).get('/discussions/42').reply(404);
      expect(await getDiscussion('42', '')).toBe(undefined);
    });

    it('errors for another status', async () => {
      nock(API_BASE_URL).get('/discussions/42').reply(500);
      await expect(
        getDiscussion('42', ''),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to fetch discussion with id 42. Expected status 2xx or 404. Received status 500."`,
      );
    });
  });

  describe('updateDiscussion', () => {
    const patch = {
      text: 'test reply',
    };
    it('makes an authorized PATCH request for the discussion id', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .patch('/discussions/42')
        .reply(200, {});

      await updateDiscussion('42', patch, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('passes the patch object in the body', async () => {
      nock(API_BASE_URL).patch('/discussions/42', patch).reply(200, {});

      await updateDiscussion('42', patch, '');
      expect(nock.isDone()).toBe(true);
    });

    it('returns a successfully updated discussion', async () => {
      const updated: Partial<DiscussionResponse> = {
        replies: [createMessage('')],
      };
      nock(API_BASE_URL).patch('/discussions/42', patch).reply(200, updated);

      expect(await updateDiscussion('42', patch, '')).toEqual(updated);
    });

    it('errors for an error status', async () => {
      nock(API_BASE_URL).patch('/discussions/42', patch).reply(500, {});

      await expect(
        updateDiscussion('42', patch, ''),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to update discussion with id 42. Expected status 200. Received status 500."`,
      );
    });
  });

  describe('createDiscussion', () => {
    const manuscriptId = '42';
    const title = 'test discussion title';
    const text = 'test discussion message';

    const payload: DiscussionCreateRequest = {
      text,
      manuscriptId,
      title,
    };

    it('makes an authorized POST request to create compliance discussion', async () => {
      nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
        .post('/discussions')
        .reply(200, {});

      await createDiscussion(manuscriptId, title, text, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('passes the post object in the body', async () => {
      nock(API_BASE_URL).post('/discussions', payload).reply(200, {});

      await createDiscussion(manuscriptId, title, text, 'Bearer x');
      expect(nock.isDone()).toBe(true);
    });

    it('returns a successfully created discussion', async () => {
      const created: Partial<DiscussionDataObject> = {
        id: 'discussion-1',
        message: createMessage(text),
        replies: [],
      };
      nock(API_BASE_URL).post('/discussions', payload).reply(200, created);

      expect(
        await createDiscussion(manuscriptId, title, text, 'Bearer x'),
      ).toEqual(created);
    });

    it('shows errors for an error status', async () => {
      nock(API_BASE_URL).post('/discussions', payload).reply(500, {});

      await expect(
        createDiscussion(manuscriptId, title, text, 'Bearer x'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Failed to create discussion. Expected status 201. Received status 500."`,
      );
    });
  });
});

describe('uploadManuscriptFileViaPresignedUrl', () => {
  const file = new File(['file content'], 'test-file.pdf', {
    type: 'application/pdf',
  });

  const authorization = 'Bearer token';

  const mockPresignedUrl =
    'https://bucket-name.s3.amazonaws.com/test-file.pdf?signature=abc';
  const mockResponse = {
    id: 'file-123',
    filename: 'test-file.pdf',
    url: 'https://bucket-name.s3.amazonaws.com/test-file.pdf',
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls S3 and file-upload-from-url endpoint with correct payloads when uploading via presigned URL', async () => {
    const handleError = jest.fn();

    // Capture request bodies
    const presignedUrlRequestBody: Record<string, unknown>[] = [];
    const uploadFromUrlRequestBody: Record<string, unknown>[] = [];

    let s3UploadRequestBodyRaw: unknown;

    // 1. Mock presigned URL generation
    const presignedUrlScope = nock('http://api')
      .post('/files/upload-url', (body) => {
        presignedUrlRequestBody.push(body);
        return true;
      })
      .reply(200, { uploadUrl: mockPresignedUrl });

    // 2. Mock S3 file upload
    const s3UploadScope = nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200, (_, requestBody) => {
        s3UploadRequestBodyRaw = requestBody;
        return {};
      });

    // 3. Mock backend file registration
    const backendScope = nock('http://api')
      .post('/manuscripts/file-upload-from-url', (body) => {
        uploadFromUrlRequestBody.push(body);
        return true;
      })
      .reply(200, mockResponse);

    // 4. Trigger the actual function
    await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    // 5. Assert presigned URL request payload
    expect(presignedUrlRequestBody[0]).toEqual({
      filename: 'test-file.pdf',
      contentType: 'application/pdf',
    });

    // 6. Assert file-upload-from-url payload
    expect(uploadFromUrlRequestBody[0]).toEqual({
      filename: 'test-file.pdf',
      fileType: 'Manuscript File',
      contentType: 'application/pdf',
      url: mockResponse.url,
    });

    // 7. Assert actual file content sent to S3
    expect(s3UploadRequestBodyRaw).toBe('[object File]');

    // 8. Assert all mocks were called
    expect(presignedUrlScope.isDone()).toBe(true);
    expect(s3UploadScope.isDone()).toBe(true);
    expect(backendScope.isDone()).toBe(true);

    // 9. Assert no error handler was triggered
    expect(handleError).not.toHaveBeenCalled();
  });

  it('handles 400 validation errors from asset creation', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/upload-url')
      .reply(200, { uploadUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200);

    nock('http://api')
      .post('/manuscripts/file-upload-from-url')
      .reply(400, { message: 'Validation failed' });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith('Validation failed');
    expect(result).toBeUndefined();
  });

  it('handles unexpected S3 upload failure', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/upload-url')
      .reply(200, { uploadUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(500, 'S3 Error');

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      expect.stringContaining('S3 upload failed'),
    );
    expect(result).toBeUndefined();
  });

  it('throws and calls handleError on unexpected error from backend after S3 upload', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/upload-url')
      .reply(200, { uploadUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200);

    nock('http://api')
      .post('/manuscripts/file-upload-from-url')
      .reply(500, { error: 'Server Error' });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to upload manuscript file via presigned URL',
      ),
    );
    expect(result).toBeUndefined();
  });

  it('handles general error', async () => {
    const handleError = jest.fn();

    nock('http://api').post('/files/upload-url').replyWithError('Boom');

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      'request to http://api/files/upload-url failed, reason: Boom',
    );
    expect(result).toBeUndefined();
  });

  it('calls handleError with fallback message if non-Error is thrown', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/upload-url')
      .reply(200, { uploadUrl: mockPresignedUrl });

    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => {
      // eslint-disable-next-line no-throw-literal
      throw 'NonErrorString';
    });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      'Unexpected error during file upload',
    );
    expect(result).toBeUndefined();

    global.fetch = originalFetch; // Restore the original fetch after the test
  });
});

describe('getPresignedUrl', () => {
  const authorization = 'Bearer token';
  const payload = {
    filename: 'test-file.pdf',
    contentType: 'application/pdf',
  };

  it('successfully returns uploadUrl', async () => {
    const uploadUrl =
      'https://bucket-name.s3.amazonaws.com/test-file.pdf?signature=abc';
    nock('http://api').post('/files/upload-url').reply(200, { uploadUrl });

    const response = await getPresignedUrl(
      payload.filename,
      payload.contentType,
      authorization,
    );

    expect(response).toEqual({ uploadUrl });
  });

  it('throws on invalid JSON response', async () => {
    nock('http://api').post('/files/upload-url').reply(200, 'not-json');

    await expect(
      getPresignedUrl(payload.filename, payload.contentType, authorization),
    ).rejects.toThrow('Failed to parse JSON response');
  });

  it('throws on non-200 status', async () => {
    nock('http://api')
      .post('/files/upload-url')
      .reply(500, { error: 'something broke' });

    await expect(
      getPresignedUrl(payload.filename, payload.contentType, authorization),
    ).rejects.toThrow(
      'Failed to generate presigned URL. Expected status 200. Received status 500',
    );
  });
});
