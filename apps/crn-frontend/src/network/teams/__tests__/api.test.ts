import {
  createListLabsResponse,
  createListTeamResponse,
  createTeamResponse,
  createManuscriptResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ManuscriptFileResponse,
  ManuscriptPostRequest,
  ResearchOutputPostRequest,
  TeamResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  createManuscript,
  createResearchOutput,
  getLabs,
  getManuscript,
  getTeam,
  getTeams,
  patchTeam,
  updateTeamResearchOutput,
  uploadManuscriptFile,
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
});
