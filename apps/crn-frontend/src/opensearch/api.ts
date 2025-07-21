/* eslint-disable no-underscore-dangle */
import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../config';

export interface ComplianceSearchRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
  size?: number;
  from?: number;
}

export interface ComplianceSearchResult {
  id: string;
  title: string;
  status: string;
  lastUpdated: string;
  teams: Array<{
    id: string;
    name: string;
  }>;
  assignedUsers: Array<{
    name: string;
    email: string;
    avatar?: string;
  }>;
  apcRequested?: boolean;
  apcCoverageRequestStatus?: string;
}

export interface ComplianceSearchResponse {
  total: number;
  results: ComplianceSearchResult[];
}

export const searchCompliance = async (
  index: string,
  request: ComplianceSearchRequest,
  authorization: string,
): Promise<ComplianceSearchResponse> => {
  // The backend expects the search body to be wrapped in a 'query' property
  const requestBody = {
    query: request,
  };

  const response = await fetch(`${API_BASE_URL}/opensearch/search/${index}`, {
    method: 'POST',
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(
      `OpenSearch request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Transform OpenSearch response to our format
  const hits = data.data?.hits?.hits || [];
  const total = data.data?.hits?.total?.value || data.data?.hits?.total || 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = hits.map((hit: any) => ({
    id: hit._source.id,
    manuscriptId: hit._source.manuscriptId,
    team: hit._source.team,
    title: hit._source.title,
    status: hit._source.status,
    lastUpdated: hit._source.lastUpdated,
    teams: hit._source.teams || '',
    assignedUsers: hit._source.assignedUsers || [],
    apcRequested: hit._source.apcRequested,
    apcCoverageRequestStatus: hit._source.apcCoverageRequestStatus,
    apcAmountRequested: hit._source.apcAmountRequested,
    declinedReason: hit._source.declinedReason,
  }));

  return {
    total,
    results,
  };
};
