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

export const getPublicationCompliance = async (
  opensearchClient: OpensearchClient<PublicationComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPublicationCompliance>,
): Promise<ListPublicationComplianceOpensearchResponse | undefined> => {
  const { tags, currentPage, pageSize, timeRange } = options;
  return opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'flat',
  });
};
