import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
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
    .search(['research-output'], options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(options.filters, options.teamId, options.userId),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const getResearchTags = async (
  type: string,
  authorization: string,
): Promise<ResearchTagResponse[]> => {
  const query = new URLSearchParams({
    take: '200',
    'filter[category]': 'Research Output',
    'filter[type]': type,
  });

  const resp = await fetch(`${API_BASE_URL}/research-tags?${query}`, {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research tags with type ${type}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  const response = await resp.json();

  return response?.items || [];
};
