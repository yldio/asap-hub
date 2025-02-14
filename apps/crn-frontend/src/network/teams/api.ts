import { AlgoliaClient } from '@asap-hub/algolia';
import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  CompletedStatusOption,
  ComplianceReportPostRequest,
  ComplianceReportResponse,
  DiscussionRequest,
  DiscussionResponse,
  ListLabsResponse,
  ListPartialManuscriptResponse,
  ListTeamResponse,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  ManuscriptResponse,
  RequestedAPCCoverageOption,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { isResearchOutputWorkingGroupRequest } from '@asap-hub/validation';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../../config';
import createListApiUrl from '../../CreateListApiUrl';

export const getTeam = async (
  id: string,
  authorization: string,
): Promise<TeamResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch team with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getTeams = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListTeamResponse> => {
  const resp = await fetch(createListApiUrl('teams', options).toString(), {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch team list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const patchTeam = async (
  id: string,
  patch: TeamPatchRequest,
  authorization: string,
): Promise<TeamResponse> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to update team with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const createResearchOutput = async (
  researchOutput: ResearchOutputPostRequest,
  authorization: string,
): Promise<ResearchOutputResponse> => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(researchOutput),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to create research output for ${
        isResearchOutputWorkingGroupRequest(researchOutput)
          ? 'Working Group'
          : 'Team'
      }. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const updateTeamResearchOutput = async (
  researchOutputId: string,
  researchOutput: ResearchOutputPostRequest,
  authorization: string,
): Promise<ResearchOutputResponse> => {
  const resp = await fetch(
    `${API_BASE_URL}/research-outputs/${researchOutputId}`,
    {
      method: 'PUT',
      headers: {
        authorization,
        'content-type': 'application/json',
        ...createSentryHeaders(),
      },
      body: JSON.stringify(researchOutput),
    },
  );
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update research output for teams ${
        researchOutput.teams
      } Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const getLabs = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListLabsResponse> => {
  const resp = await fetch(createListApiUrl('labs', options).toString(), {
    method: 'GET',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch labs. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const createManuscript = async (
  manuscript: ManuscriptPostRequest,
  authorization: string,
): Promise<ManuscriptResponse> => {
  const resp = await fetch(`${API_BASE_URL}/manuscripts`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(manuscript),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to create manuscript. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const updateManuscript = async (
  manuscriptId: string,
  manuscript: ManuscriptPutRequest,
  authorization: string,
): Promise<ManuscriptResponse> => {
  const resp = await fetch(`${API_BASE_URL}/manuscripts/${manuscriptId}`, {
    method: 'PUT',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(manuscript),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update manuscript with id ${manuscriptId}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const resubmitManuscript = async (
  manuscriptId: string,
  manuscript: ManuscriptPostRequest,
  authorization: string,
): Promise<ManuscriptResponse> => {
  const resp = await fetch(`${API_BASE_URL}/manuscripts/${manuscriptId}`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(manuscript),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to resubmit manuscript with id ${manuscriptId}. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export type ManuscriptsOptions = Omit<GetListOptions, 'filters'> & {
  requestedAPCCoverage: RequestedAPCCoverageOption;
  completedStatus: CompletedStatusOption;
};

export const getManuscripts = async (
  algoliaClient: AlgoliaClient<'crn'>,
  {
    searchQuery,
    currentPage,
    pageSize,
    requestedAPCCoverage,
    completedStatus,
  }: ManuscriptsOptions,
): Promise<ListPartialManuscriptResponse> => {
  const getApcCoverageFilter = (apcCoverage: RequestedAPCCoverageOption) => {
    switch (apcCoverage) {
      case 'submitted':
        return `requestingApcCoverage:"Already Submitted"`;
      case 'yes':
        return 'requestingApcCoverage:Yes';
      case 'no':
        return 'requestingApcCoverage:No';
      default:
        return '';
    }
  };

  const apcCoverageFilter = getApcCoverageFilter(requestedAPCCoverage);
  const completedStatusFilter =
    completedStatus === 'hide'
      ? `(NOT status:Compliant AND NOT status:"Closed (other)")`
      : '';

  const filters = [apcCoverageFilter, completedStatusFilter]
    .filter(Boolean)
    .join(' AND ');

  const result = await algoliaClient.search(['manuscript'], searchQuery, {
    filters,
    page: currentPage ?? undefined,
    hitsPerPage: pageSize ?? undefined,
  });

  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};

export const getManuscript = async (
  id: string,
  authorization: string,
): Promise<ManuscriptResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/manuscripts/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch manuscript with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const uploadChunk = async (
  chunk: Blob,
  totalChunks: number,
  i: number,
  fileName: string,
  tempId: string,
  authorization: string,
) => {
  const formData = new FormData();
  formData.append('file', chunk);
  formData.append('fileName', fileName);
  formData.append('chunkIndex', i.toString());
  formData.append('totalChunks', totalChunks.toString());
  formData.append('fileType', 'Manuscript File');
  formData.append('fileId', tempId);

  const response = await fetch(`${API_BASE_URL}/manuscripts/file-upload`, {
    method: 'POST',
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Chunk ${i} failed to upload with status ${response.status}`,
    );
  }

  return response;
};

export const uploadManuscriptFile = async (
  file: File,
  fileType: ManuscriptFileType,
  authorization: string,
  handleError: (errorMessage: string) => void,
): Promise<ManuscriptFileResponse | undefined> => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  let resp: Response | undefined;
  const tempId = uuidv4();

  try {
    const uploadPromises = Array.from({ length: totalChunks }, async (_, i) => {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      return uploadChunk(
        chunk,
        totalChunks,
        i,
        file.name,
        tempId,
        authorization,
      );
    });

    // Execute all chunk uploads in parallel and filter out any undefined values
    const [finalResponse] = (await Promise.all(uploadPromises)).filter(Boolean);

    resp = finalResponse;
  } catch (error) {
    handleError(
      `Failed to upload ${fileType.toLowerCase()}: ${(error as Error).message}`,
    );
    return undefined;
  }

  if (!resp) {
    throw new Error(`Failed to upload ${fileType.toLowerCase()}.`);
  }

  return resp.json();
};

export const createComplianceReport = async (
  complianceReport: ComplianceReportPostRequest,
  authorization: string,
): Promise<ComplianceReportResponse> => {
  const resp = await fetch(`${API_BASE_URL}/compliance-reports`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(complianceReport),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to create compliance report. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const updateDiscussion = async (
  discussionId: string,
  discussion: DiscussionRequest,
  authorization: string,
  manuscriptId?: string,
): Promise<{
  discussion: DiscussionResponse;
  manuscript?: ManuscriptResponse;
}> => {
  const resp = await fetch(`${API_BASE_URL}/discussions/${discussionId}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({ ...discussion, manuscriptId }),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update discussion with id ${discussionId}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const endDiscussion = async (
  discussionId: string,
  authorization: string,
): Promise<DiscussionResponse> => {
  const resp = await fetch(`${API_BASE_URL}/discussions/${discussionId}/end`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to end discussion with id ${discussionId}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const getDiscussion = async (
  id: string,
  authorization: string,
): Promise<DiscussionResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/discussions/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch discussion with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const createComplianceDiscussion = async (
  complianceReportId: string,
  message: string,
  authorization: string,
): Promise<DiscussionResponse> => {
  const resp = await fetch(`${API_BASE_URL}/discussions`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({
      message,
      id: complianceReportId,
      type: 'compliance-report',
    }),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to create discussion. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};
