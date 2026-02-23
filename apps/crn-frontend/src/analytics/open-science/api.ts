import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
  SortPreprintCompliance,
  SortPublicationCompliance,
  ListPublicationComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
} from '@asap-hub/model';
import { OpensearchClient } from '../utils/opensearch';
import { OpensearchSortMap } from '../utils/opensearch/types';

export const getPreprintCompliance = async (
  opensearchClient: OpensearchClient<PreprintComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPreprintCompliance>,
): Promise<ListPreprintComplianceOpensearchResponse | undefined> => {
  const { tags, currentPage, pageSize, timeRange } = options;
  return opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'flat',
  });
};

const publicationComplianceOpensearchSort: OpensearchSortMap<SortPublicationCompliance> =
  {
    team_asc: [{ 'teamName.keyword': { order: 'asc' } }],
    team_desc: [{ 'teamName.keyword': { order: 'desc' } }],
    publications_asc: [{ overallCompliance: { order: 'asc' } }],
    publications_desc: [{ overallCompliance: { order: 'desc' } }],
    datasets_asc: [{ datasetsPercentage: { order: 'asc' } }],
    datasets_desc: [{ datasetsPercentage: { order: 'desc' } }],
    protocols_asc: [{ protocolsPercentage: { order: 'asc' } }],
    protocols_desc: [{ protocolsPercentage: { order: 'desc' } }],
    code_asc: [{ codePercentage: { order: 'asc' } }],
    code_desc: [{ codePercentage: { order: 'desc' } }],
    lab_materials_asc: [{ labMaterialsPercentage: { order: 'asc' } }],
    lab_materials_desc: [{ labMaterialsPercentage: { order: 'desc' } }],
  };

export const getPublicationCompliance = async (
  opensearchClient: OpensearchClient<PublicationComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPublicationCompliance>,
): Promise<ListPublicationComplianceOpensearchResponse | undefined> => {
  const { tags, currentPage, pageSize, timeRange, sort } = options;
  return opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'flat',
    sort: sort ? publicationComplianceOpensearchSort[sort] : undefined,
  });
};
