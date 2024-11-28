import {
  createDiscussionResponse,
  createListLabsResponse,
  createListTeamResponse,
  createManuscriptResponse,
  createTeamResponse,
  createMessage,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ComplianceReportPostRequest,
  DiscussionResponse,
  ManuscriptFileResponse,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  ResearchOutputPostRequest,
  TeamResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  createComplianceReport,
  createManuscript,
  createResearchOutput,
  getDiscussion,
  getLabs,
  getManuscript,
  getTeam,
  getTeams,
  patchTeam,
  updateManuscript,
  updateDiscussion,
  updateTeamResearchOutput,
  uploadManuscriptFile,
  resubmitManuscript,
} from '../api';

jest.mock('../../../config');

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
      status: 'Waiting for ASAP Reply',
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
      url: 'https://compliancereport.com',
      description: 'Compliance report description',
      manuscriptVersionId: 'manuscript-version-1',
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
      replyText: 'test reply',
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
});
