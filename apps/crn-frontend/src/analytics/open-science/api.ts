import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
  SortPreprintCompliance,
} from '@asap-hub/model';
import { OpensearchClient } from '../utils/opensearch';

export const getPreprintCompliance = async (
  opensearchClient: OpensearchClient<PreprintComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPreprintCompliance>,
): Promise<ListPreprintComplianceOpensearchResponse | undefined> => {
  const { tags, currentPage, pageSize, timeRange } = options;
  return opensearchClient.search(
    tags,
    currentPage,
    pageSize,
    timeRange,
    'teams',
  );
};
