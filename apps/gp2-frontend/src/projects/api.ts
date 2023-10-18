import { AlgoliaClient } from '@asap-hub/algolia';
import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

const getAllFilters = ({ status = [], type = [] }: gp2.FetchProjectFilter) => {
  const statusFilters = status
    ?.map((filter) => `status:"${filter}"`)
    .join(' OR ');
  const opportunityFilter =
    type?.includes(gp2.opportunitiesAvailable) && 'opportunitiesAvailable=1';
  const traineeFilter =
    type?.includes(gp2.traineeProject) && 'traineeProject=1';

  return [statusFilters, opportunityFilter, traineeFilter]
    .filter(Boolean)
    .join(' AND ');
};

export type ProjectListOptions = GetListOptions & gp2.FetchProjectFilter;
export const getProjects = async (
  client: AlgoliaClient<'gp2'>,
  options: ProjectListOptions,
) =>
  client
    .search(['project'], options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(options),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const getProject = async (
  id: string,
  authorization: string,
): Promise<gp2.ProjectResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/project/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch project with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const putProjectResources = async (
  id: string,
  payload: gp2.ProjectResourcesPutRequest,
  authorization: string,
): Promise<gp2.ProjectResponse> => {
  const resp = await fetch(`${API_BASE_URL}/project/${id}/resources`, {
    method: 'PUT',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update project resources for id ${id} Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};
