import qs from 'qs';
import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  createSentryHeaders,
  createFeatureFlagHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
  ResearchTagResponse,
  FetchResearchTagsOptions,
  ListResponse,
} from '@asap-hub/model';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export type ResearchOutputListOptions =
  | ResearchOutputPublishedListOptions
  | ResearchOutputDraftListOptions;

type ResearchOutputPublishedListOptions = GetListOptions & {
  teamId?: string;
  userId?: string;
  workingGroupId?: string;
  draftsOnly?: false;
};
type ResearchOutputDraftListOptions = GetListOptions & {
  userAssociationMember: boolean;
  teamId?: string;
  workingGroupId?: string;
  draftsOnly: true;
};

export const getResearchOutput = async (
  id: string,
  authorization: string,
): Promise<ResearchOutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch research output with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const researchOutputDocumentTypeFilters: Record<
  ResearchOutputDocumentType,
  { filter: string }
> = {
  'Grant Document': { filter: 'documentType:"Grant Document"' },
  Presentation: { filter: 'documentType:Presentation' },
  Protocol: { filter: 'documentType:Protocol' },
  Dataset: { filter: 'documentType:Dataset' },
  Bioinformatics: { filter: 'documentType:Bioinformatics' },
  'Lab Resource': { filter: 'documentType:"Lab Resource"' },
  Article: { filter: 'documentType:Article' },
  Report: { filter: 'documentType:Report' },
};

export const getTypeFilters = (filters: Set<string>): string =>
  Object.entries(researchOutputDocumentTypeFilters)
    .reduce<string[]>(
      (acc, [key, { filter }]) => (filters.has(key) ? [filter, ...acc] : acc),
      [],
    )
    .join(' OR ');

export const getAllFilters = (
  filters: Set<string>,
  teamId?: string,
  userId?: string,
  workingGroupId?: string,
) => {
  const typeFilters = getTypeFilters(filters);
  const typeFiltersWithParenthesis = typeFilters
    ? `(${getTypeFilters(filters)})`
    : typeFilters;

  const teamFilter = teamId ? `teams.id:"${teamId}"` : '';
  const wgFilter = workingGroupId ? `workingGroups.id:"${workingGroupId}"` : '';
  const authorFilter = userId ? `authors.id:"${userId}"` : '';

  return [typeFiltersWithParenthesis, teamFilter, authorFilter, wgFilter]
    .filter(Boolean)
    .join(' AND ');
};

export const getResearchOutputs = (
  client: AlgoliaSearchClient,
  options: ResearchOutputPublishedListOptions,
) =>
  client
    .search(['research-output'], options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(
        options.filters,
        options.teamId,
        options.userId,
        options.workingGroupId,
      ),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const getDraftResearchOutputs = async (
  options: ResearchOutputDraftListOptions,
  authorization: string,
): Promise<ListResponse<ResearchOutputResponse>> => {
  if (options.userAssociationMember) {
    const url = createListApiUrl(`research-outputs`, options);
    url.searchParams.set('status', 'draft');
    if (options.workingGroupId) {
      url.searchParams.set('workingGroupId', options.workingGroupId);
    }
    if (options.teamId) {
      url.searchParams.set('teamId', options.teamId);
    }

    const resp = await fetch(url.toString(), {
      headers: { authorization },
    });
    if (!resp.ok) {
      throw new Error(
        `Failed to fetch draft research outputs. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      );
    }
    return resp.json();
  }
  return {
    items: [],
    total: 0,
  };
};

export const getResearchTags = async (
  authorization: string,
): Promise<ResearchTagResponse[]> => {
  const options: FetchResearchTagsOptions = {
    take: 200,
    filter: {
      entity: 'Research Output',
    },
  };
  const query = qs.stringify(options);

  const resp = await fetch(`${API_BASE_URL}/research-tags?${query}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research tags. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  const response = await resp.json();

  return response?.items || [];
};
