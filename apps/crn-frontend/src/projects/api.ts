import { AlgoliaClient } from '@asap-hub/algolia';
import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  ArticleItem,
  GrantType,
  ListProjectMilestonesResponse,
  ListProjectResponse,
  ProjectDetail,
  ProjectStatus,
  ProjectTool,
  ProjectType,
} from '@asap-hub/model';
import createListApiUrl from '../CreateListApiUrl';
import { API_BASE_URL } from '../config';

const escapeFacetValue = (value: string) => value.replace(/"/g, '\\"');

const buildFacetExpressions = (
  facetFilters?: ProjectListOptions['facetFilters'],
) => {
  if (!facetFilters) {
    return [];
  }

  return Object.entries(facetFilters)
    .map(([attribute, values]) => {
      if (!values.length) {
        return undefined;
      }
      const escapedValues = values.map(
        (value) => `"${escapeFacetValue(value)}"`,
      );
      if (escapedValues.length === 1) {
        return `${attribute}:${escapedValues[0]}`;
      }
      return `(${escapedValues
        .map((value) => `${attribute}:${value}`)
        .join(' OR ')})`;
    })
    .filter((expression): expression is string => Boolean(expression));
};

const buildFilters = ({
  projectType,
  statusFilters,
  facetFilters,
}: Pick<
  ProjectListOptions,
  'projectType' | 'statusFilters' | 'facetFilters'
>) => {
  const filters: string[] = [`projectType:"${projectType}"`];

  if (statusFilters && statusFilters.length > 0) {
    filters.push(
      `(${statusFilters.map((status) => `status:"${status}"`).join(' OR ')})`,
    );
  }

  filters.push(...buildFacetExpressions(facetFilters));

  return filters.join(' AND ');
};

export type ProjectFacetFilters = Record<string, ReadonlyArray<string>>;

export type ProjectListOptions = GetListOptions & {
  projectType: ProjectType;
  statusFilters?: ProjectStatus[];
  facetFilters?: ProjectFacetFilters;
};

export const getProjects = async (
  client: AlgoliaClient<'crn'>,
  options: ProjectListOptions,
) =>
  client
    .search(['project'], options.searchQuery ?? '', {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: buildFilters(options),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const toListProjectResponse = (
  response: Awaited<ReturnType<typeof getProjects>>,
): ListProjectResponse => ({
  total: response.nbHits,
  items: response.hits,
  algoliaQueryId: response.queryID,
  algoliaIndexName: response.index,
});

export const patchProject = async (
  id: string,
  patch: { tools: ProjectTool[] },
  authorization: string,
): Promise<ProjectDetail> => {
  const resp = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update project with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};

export const getAimArticles = async (
  aimId: string,
  authorization: string,
): Promise<ReadonlyArray<ArticleItem>> => {
  const resp = await fetch(`${API_BASE_URL}/aims/${aimId}/articles`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new BackendError(
      `Failed to fetch articles for aim ${aimId}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};

export const getMilestoneArticles = async (
  milestoneId: string,
  authorization: string,
): Promise<ReadonlyArray<ArticleItem>> => {
  const resp = await fetch(
    `${API_BASE_URL}/milestones/${milestoneId}/articles`,
    {
      headers: { authorization, ...createSentryHeaders() },
    },
  );
  if (!resp.ok) {
    throw new BackendError(
      `Failed to fetch articles for milestone ${milestoneId}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};

export const getProject = async (
  id: string,
  authorization: string,
): Promise<ProjectDetail | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new BackendError(
      `Failed to fetch project with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};

export type MilestonesListOptions = GetListOptions & {
  grantType?: GrantType;
  projectId: string;
};

export const getProjectMilestones = async (
  options: MilestonesListOptions,
  authorization: string,
): Promise<ListProjectMilestonesResponse> => {
  const { projectId, grantType, ...searchOptions } = options;
  const url = createListApiUrl(`projects/${projectId}/milestones`, {
    ...searchOptions,
  });
  if (grantType) {
    url.searchParams.set('grantType', grantType);
  }

  const resp = await fetch(url.toString(), {
    headers: { authorization },
  });
  if (!resp.ok) {
    throw new BackendError(
      `Failed to fetch milestones for project with id ${projectId}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};
