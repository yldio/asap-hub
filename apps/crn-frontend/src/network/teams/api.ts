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
  ManuscriptStatus,
  RequestedAPCCoverageOption,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { isResearchOutputWorkingGroupRequest } from '@asap-hub/validation';
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
  selectedStatuses: ManuscriptStatus[];
};

export const getManuscripts = async (
  algoliaClient: AlgoliaClient<'crn'>,
  {
    searchQuery,
    currentPage,
    pageSize,
    requestedAPCCoverage,
    completedStatus,
    selectedStatuses,
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

  const selectedStatusesList = selectedStatuses.map(
    (status) => `status:"${status}"`,
  );
  const selectedStatusesFilter = selectedStatusesList.length
    ? `(${selectedStatusesList.join(' OR ')})`
    : '';

  const filters = [
    apcCoverageFilter,
    completedStatusFilter,
    selectedStatusesFilter,
  ]
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

export const uploadManuscriptFile = async (
  file: File,
  fileType: ManuscriptFileType,
  authorization: string,
  handleError: (errorMessage: string) => void,
): Promise<ManuscriptFileResponse | undefined> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  const resp = await fetch(`${API_BASE_URL}/manuscripts/file-upload`, {
    method: 'POST',
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
    body: formData,
  });

  if (!resp.ok) {
    if (resp.status === 400 && handleError) {
      handleError((await resp.json()).message);
      return undefined;
    }
    throw new Error(
      `Failed to upload ${fileType.toLowerCase()}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
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

// Requests presigned URL from the backend, uploads the file to S3, and then sends the URL to the backend to create the asset
export const uploadManuscriptFileViaPresignedUrl = async (
  file: File,
  fileType: ManuscriptFileType,
  authorization: string,
  handleError: (errorMessage: string) => void,
): Promise<ManuscriptFileResponse | undefined> => {
  try {
    // Request presigned S3 URL
    const { uploadUrl } = await getPresignedUrl(
      file.name,
      file.type,
      authorization,
    );

    // Upload file to S3
    const s3UploadResp = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!s3UploadResp.ok) {
      throw new Error(`S3 upload failed: ${s3UploadResp.statusText}`);
    }

    // Send the URL to the backend to create the asset
    const fileUrl = uploadUrl.split('?')[0];

    const resp = await fetch(
      `${API_BASE_URL}/manuscripts/file-upload-from-url`,
      {
        method: 'POST',
        headers: {
          authorization,
          'Content-Type': 'application/json',
          ...createSentryHeaders(),
        },
        body: JSON.stringify({
          fileType,
          url: fileUrl,
          filename: file.name,
          contentType: file.type,
        }),
      },
    );

    if (!resp.ok) {
      if (resp.status === 400 && handleError) {
        handleError((await resp.json()).message);
        return undefined;
      }
      throw new Error(
        `Failed to upload ${fileType.toLowerCase()} via presigned URL. Received status ${
          resp.status
        }: ${resp.statusText}`,
      );
    }

    return await resp.json();
  } catch (error) {
    console.error(error);
    handleError(
      error instanceof Error
        ? error.message
        : 'Unexpected error during file upload',
    );
    return undefined;
  }
};

export const getPresignedUrl = async (
  filename: string,
  contentType: string,
  authorization: string,
): Promise<{ uploadUrl: string }> => {
  const resp = await fetch(`${API_BASE_URL}/files/upload-url`, {
    method: 'POST',
    headers: {
      authorization,
      'Content-Type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({ filename, contentType }),
  });

  let response;
  try {
    response = await resp.json();
  } catch (error) {
    throw new BackendError(
      `Failed to parse JSON response when generating presigned URL. Status: ${resp.status}`,
      {
        error: 'ParseError',
        message: 'Failed to parse JSON response',
        statusCode: resp.status,
      },
      resp.status,
    );
  }

  if (!resp.ok) {
    throw new BackendError(
      `Failed to generate presigned URL. Expected status 200. Received status ${resp.status}: ${resp.statusText}`,
      response,
      resp.status,
    );
  }

  return response;
};
