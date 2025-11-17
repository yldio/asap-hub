import { AlgoliaClient } from '@asap-hub/algolia';
import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  ListProjectResponse,
  ProjectResponse,
  ProjectStatus,
  ProjectType,
} from '@asap-hub/model';
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

export const getProject = async (
  id: string,
  authorization: string,
): Promise<ProjectResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/project/${id}`, {
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
