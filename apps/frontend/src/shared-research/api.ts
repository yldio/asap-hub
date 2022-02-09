import { ResearchOutputResponse, ResearchOutputType } from '@asap-hub/model';
import { AlgoliaSearchClient } from '@asap-hub/algolia';

import { createSentryHeaders, GetListOptions } from '../api-util';
import { API_BASE_URL } from '../config';

export type ResearchOutputListOptions = GetListOptions & {
  teamId?: string;
  userId?: string;
};

export const getResearchOutput = async (
  id: string,
  authorization: string,
): Promise<ResearchOutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
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

export const researchOutputTypeFilters: Record<
  ResearchOutputType,
  { filter: string }
> = {
  'Grant Document': { filter: 'type:"Grant Document"' },
  Presentation: { filter: 'type:Presentation' },
  Protocol: { filter: 'type:Protocol' },
  Dataset: { filter: 'type:Dataset' },
  Bioinformatics: { filter: 'type:Bioinformatics' },
  'Lab Resource': { filter: 'type:"Lab Resource"' },
  Article: { filter: 'type:Article' },
};

export const getTypeFilters = (filters: Set<string>): string =>
  Object.entries(researchOutputTypeFilters)
    .reduce<string[]>(
      (acc, [key, { filter }]) => (filters.has(key) ? [filter, ...acc] : acc),
      [],
    )
    .join(' OR ');

export const getAllFilters = (
  filters: Set<string>,
  teamId?: string,
  userId?: string,
) => {
  const typeFilters = getTypeFilters(filters);
  const typeFiltersWithParenthesis = typeFilters
    ? `(${getTypeFilters(filters)})`
    : typeFilters;
  const teamFilter = teamId ? `teams.id:"${teamId}"` : '';
  const authorFilter = userId ? `authors.id:"${userId}"` : '';

  return [typeFiltersWithParenthesis, teamFilter, authorFilter]
    .filter(Boolean)
    .join(' AND ');
};

export const getResearchOutputs = (
  client: AlgoliaSearchClient,
  options: ResearchOutputListOptions,
) =>
  client
    .searchEntity('research-output', options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(options.filters, options.teamId, options.userId),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });
