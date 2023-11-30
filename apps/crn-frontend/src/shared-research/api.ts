import { AlgoliaClient } from '@asap-hub/algolia';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import {
  FetchResearchTagsOptions,
  ListResponse,
  ResearchOutputDocumentType,
  researchOutputDocumentTypes,
  ResearchOutputPublishingEntities,
  ResearchOutputPublishingEntitiesValues,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import qs from 'qs';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export type ResearchOutputListOptions =
  | ResearchOutputPublishedListOptions
  | ResearchOutputDraftListOptions;

type BasicOptions = {
  teamId?: string;
  workingGroupId?: string;
  tags?: string[];
  noResultsWithoutCriteria?: boolean;
};

type ResearchOutputPublishedListOptions = GetListOptions &
  BasicOptions & {
    userId?: string;
    draftsOnly?: false;
  };
type ResearchOutputDraftListOptions = GetListOptions &
  BasicOptions & {
    userAssociationMember: boolean;
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

const isSourceFilter = (filter: string) =>
  ResearchOutputPublishingEntitiesValues.includes(
    filter as ResearchOutputPublishingEntities,
  );

const isDocumentTypeFilter = (filter: string) =>
  researchOutputDocumentTypes.includes(filter as ResearchOutputDocumentType);

type SplitFilters = {
  source: string[];
  documentTypes: string[];
};

const splitFiltersByType = (filters: Set<string>) =>
  Array.from(filters).reduce(
    (splitFilters: SplitFilters, filter) => {
      if (isSourceFilter(filter)) {
        splitFilters.source.push(filter);
      }

      if (isDocumentTypeFilter(filter)) {
        splitFilters.documentTypes.push(filter);
      }

      return splitFilters;
    },
    {
      source: [],
      documentTypes: [],
    },
  );

export const getAllFilters = (
  filters: Set<string>,
  teamId?: string,
  userId?: string,
  workingGroupId?: string,
) => {
  const splitFilters = splitFiltersByType(filters);

  const sourceFilter = splitFilters.source
    .map((filter) => `publishingEntity:"${filter}"`)
    .join(' OR ');

  const documentTypesFilter = splitFilters.documentTypes
    .map((filter) => `documentType:"${filter}"`)
    .join(' OR ');

  const algoliaFilters =
    sourceFilter && documentTypesFilter
      ? `(${sourceFilter}) AND (${documentTypesFilter})`
      : sourceFilter
      ? `(${sourceFilter})`
      : documentTypesFilter
      ? `(${documentTypesFilter})`
      : '';

  const teamFilter = teamId ? `teams.id:"${teamId}"` : '';
  const wgFilter = workingGroupId ? `workingGroups.id:"${workingGroupId}"` : '';
  const authorFilter = userId ? `authors.id:"${userId}"` : '';

  return [algoliaFilters, teamFilter, authorFilter, wgFilter]
    .filter(Boolean)
    .join(' AND ');
};

export const getResearchOutputs = (
  client: AlgoliaClient<'crn'>,
  options: ResearchOutputPublishedListOptions,
) =>
  client.search(['research-output'], options.searchQuery, {
    page: options.currentPage ?? 0,
    hitsPerPage: options.pageSize ?? 10,
    tagFilters: options.tags,
    filters: getAllFilters(
      options.filters,
      options.teamId,
      options.userId,
      options.workingGroupId,
    ),
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

const sourceMapping = new Map([
  ['Working Group', 'working-groups'],
  ['Team', 'teams'],
]);
// As algolia has reduced data we need to fetch data from cms for `Export as CSV` feature
export const getResearchOutputsFromCMS = async (
  options: ResearchOutputPublishedListOptions,
  authorization: string,
): Promise<ListResponse<ResearchOutputResponse>> => {
  const splitFilters = splitFiltersByType(options.filters);

  const url = createListApiUrl(`research-outputs`, {
    ...options,
    filters: new Set(splitFilters.documentTypes),
  });

  if (options.workingGroupId) {
    url.searchParams.set('workingGroupId', options.workingGroupId);
  }
  if (options.teamId) {
    url.searchParams.set('teamId', options.teamId);
  }

  if (splitFilters.source.length) {
    for (const source of splitFilters.source) {
      const value = sourceMapping.get(source);
      if (value) {
        url.searchParams.append('source', value);
      }
    }
  }

  const resp = await fetch(url.toString(), {
    headers: { authorization },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research outputs. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
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

export default getResearchOutputsFromCMS;
