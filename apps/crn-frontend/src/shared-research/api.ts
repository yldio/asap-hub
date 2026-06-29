import { AlgoliaClient, buildAlgoliaFilters } from '@asap-hub/algolia';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import {
  FetchResearchTagsOptions,
  ListResponse,
  ResearchOutputDocumentType,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
  ResearchTagResponse,
  ResearchThemeResponse,
  ResearchThemeType,
  ResourceTypeResponse,
} from '@asap-hub/model';
import qs from 'qs';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export type ResearchOutputListOptions =
  | ResearchOutputPublishedListOptions
  | ResearchOutputDraftListOptions;

type BasicOptions = {
  teamId?: string;
  projectId?: string;
  workingGroupId?: string;
  tags?: string[];
  noResultsWithoutCriteria?: boolean;
  documentType?: ResearchOutputDocumentType[];
  source?: ResearchOutputPublishingEntities[];
};

type ResearchOutputPublishedListOptions = Omit<GetListOptions, 'filters'> &
  BasicOptions & {
    userId?: string;
    draftsOnly?: false;
  };
type ResearchOutputDraftListOptions = Omit<GetListOptions, 'filters'> &
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

export const getAllFilters = (
  documentType?: ResearchOutputDocumentType[],
  source?: ResearchOutputPublishingEntities[],
  teamId?: string,
  userId?: string,
  workingGroupId?: string,
  projectId?: string,
) => {
  const publishingEntityFilter = buildAlgoliaFilters(
    'publishingEntity',
    source,
  );
  const documentTypeFilter = buildAlgoliaFilters('documentType', documentType);

  return [
    publishingEntityFilter && `(${publishingEntityFilter})`,
    documentTypeFilter && `(${documentTypeFilter})`,
    teamId && `teams.id:"${teamId}"`,
    projectId && `project.id:"${projectId}"`,
    workingGroupId && `workingGroups.id:"${workingGroupId}"`,
    userId && `authors.id:"${userId}"`,
  ]
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
      options.documentType,
      options.source,
      options.teamId,
      options.userId,
      options.workingGroupId,
      options.projectId,
    ),
  });

export const getDraftResearchOutputs = async (
  options: ResearchOutputDraftListOptions,
  authorization: string,
): Promise<ListResponse<ResearchOutputResponse>> => {
  if (options.userAssociationMember) {
    const url = createListApiUrl(`research-outputs`, {
      ...options,
      filters: new Set(),
    });
    url.searchParams.set('status', 'draft');
    const addFilter = (name: string, items?: string[]) =>
      items?.forEach((item) =>
        url.searchParams.append(`filter[${name}]`, item),
      );
    addFilter('documentType', options.documentType);
    addFilter('source', options.source);
    if (options.workingGroupId) {
      url.searchParams.set('workingGroupId', options.workingGroupId);
    }
    if (options.teamId) {
      url.searchParams.set('teamId', options.teamId);
    }
    if (options.projectId) {
      url.searchParams.set('projectId', options.projectId);
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

export const getResearchThemes = async (
  authorization: string,
  types?: ReadonlyArray<ResearchThemeType>,
): Promise<ResearchThemeResponse[]> => {
  const url = new URL(`${API_BASE_URL}/research-themes`);
  types?.forEach((value) => url.searchParams.append('types', value));

  const resp = await fetch(url.toString(), {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research themes. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  const response = await resp.json();

  return response?.items || [];
};

export const getResourceTypes = async (
  authorization: string,
): Promise<ResourceTypeResponse[]> => {
  const resp = await fetch(`${API_BASE_URL}/resource-types`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch resource types. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  const response = await resp.json();

  return response?.items || [];
};
