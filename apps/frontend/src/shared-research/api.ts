import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
  ResearchOutputType,
} from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch/lite';

import { createListApiUrl, GetListOptions } from '../api-util';
import { API_BASE_URL } from '../config';

export const getResearchOutput = async (
  id: string,
  authorization: string,
): Promise<ResearchOutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs/${id}`, {
    headers: { authorization },
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
  Proposal: { filter: 'type:Proposal' },
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

export const getAllFilters = (filters: Set<string>, teamId?: string) => {
  const typeFilters = getTypeFilters(filters);
  const teamFilter = teamId ? `team.id:"${teamId}"` : '';
  const filtersSeparator = !!typeFilters && !!teamFilter ? ' AND ' : '';
  return `${typeFilters}${filtersSeparator}${teamFilter}`;
};

export const getResearchOutputs = (
  { search }: SearchIndex,
  options: GetListOptions,
) =>
  search<ResearchOutputResponse>(options.searchQuery, {
    page: options.currentPage ?? 0,
    hitsPerPage: options.pageSize ?? 10,
    filters: getAllFilters(options.filters, options.teamId),
  }).catch((error: Error) => {
    throw new Error(`Could not search: ${error.message}`);
  });

export const getResearchOutputsLegacy = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListResearchOutputResponse> => {
  const resp = await fetch(
    createListApiUrl('research-outputs', options).toString(),
    {
      headers: { authorization },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research output list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
