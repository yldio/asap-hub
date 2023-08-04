import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getOutput = async (
  id: string,
  authorization: string,
): Promise<gp2.OutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/outputs/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch output with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export type OutputListOptions = GetListOptions & gp2.FetchOutputFilter;

export const researchOutputDocumentTypeFilters: Record<
  gp2.OutputDocumentType,
  { filter: string }
> = {
  'Procedural Form': { filter: 'documentType:"Procedural Form"' },
  'GP2 Reports': { filter: 'documentType:"GP2 Reports"' },
  'Training Materials': { filter: 'documentType:"Training Materials"' },
  Dataset: { filter: 'documentType:Dataset' },
  Article: { filter: 'documentType:Article' },
  'Code/Software': { filter: 'documentType:"Code/Software"' },
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
  workingGroup?: string,
  project?: string,
  author?: string,
) => {
  const typeFilters = getTypeFilters(filters);
  const typeFiltersWithParenthesis = typeFilters
    ? `(${getTypeFilters(filters)})`
    : typeFilters;

  const workingGroupFilter = workingGroup
    ? `workingGroup.id:"${workingGroup}"`
    : '';
  const projectFilter = project ? `project.id:"${project}"` : '';
  const authorFilter = author ? `authors.id:"${author}"` : '';

  return [
    typeFiltersWithParenthesis,
    workingGroupFilter,
    authorFilter,
    projectFilter,
  ]
    .filter(Boolean)
    .join(' AND ');
};

export const getOutputs = (
  client: AlgoliaSearchClient<'gp2'>,
  options: OutputListOptions,
) =>
  client
    .search(['output'], options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(
        options.filters,
        options.workingGroup,
        options.project,
        options.author,
      ),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const createOutput = async (
  output: gp2.OutputPostRequest,
  authorization: string,
): Promise<gp2.OutputResponse> => {
  const resp = await fetch(`${API_BASE_URL}/outputs`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(output),
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to create output. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const updateOutput = async (
  outputId: string,
  output: gp2.OutputPutRequest,
  authorization: string,
): Promise<gp2.OutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/outputs/${outputId}`, {
    method: 'PUT',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(output),
  });

  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to update output ${outputId}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
