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

const preprintComplianceOpensearchSort: OpensearchSortMap<SortPreprintCompliance> =
  {
    team_asc: [{ 'teamName.keyword': { order: 'asc' } }],
    team_desc: [{ 'teamName.keyword': { order: 'desc' } }],
    number_of_preprints_asc: [
      {
        numberOfPreprints: {
          order: 'asc',
          missing: '_first',
        },
      },
    ],
    number_of_preprints_desc: [
      {
        numberOfPreprints: {
          order: 'desc',
          missing: '_last',
        },
      },
    ],
    posted_prior_asc: [
      {
        postedPriorPercentage: {
          order: 'asc',
          missing: '_first',
        },
      },
    ],
    posted_prior_desc: [
      {
        postedPriorPercentage: {
          order: 'desc',
          missing: '_last',
        },
      },
    ],
  };

const searchCompliance = async <
  TItem,
  TSort extends `${string}_asc` | `${string}_desc`,
  TListResponse,
>(
  opensearchClient: OpensearchClient<TItem>,
  options: AnalyticsSearchOptionsWithFiltering<TSort>,
  sortMap: OpensearchSortMap<TSort>,
): Promise<TListResponse | undefined> => {
  const { tags, currentPage, pageSize, timeRange, sort } = options;
  return opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'flat',
    sort: sort ? sortMap[sort] : undefined,
  }) as Promise<TListResponse | undefined>;
};

export const getPreprintCompliance = async (
  opensearchClient: OpensearchClient<PreprintComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPreprintCompliance>,
): Promise<ListPreprintComplianceOpensearchResponse | undefined> =>
  searchCompliance<
    PreprintComplianceOpensearchResponse,
    SortPreprintCompliance,
    ListPreprintComplianceOpensearchResponse
  >(opensearchClient, options, preprintComplianceOpensearchSort);

// N/A (null / "Limited Data") rows should appear first when sorting asc and
// last when sorting desc, so they never push real data off the visible pages.
const publicationComplianceOpensearchSort: OpensearchSortMap<SortPublicationCompliance> =
  {
    team_asc: [{ 'teamName.keyword': { order: 'asc' } }],
    team_desc: [{ 'teamName.keyword': { order: 'desc' } }],
    publications_asc: [
      { overallCompliance: { order: 'asc', missing: '_first' } },
    ],
    publications_desc: [
      { overallCompliance: { order: 'desc', missing: '_last' } },
    ],
    datasets_asc: [{ datasetsPercentage: { order: 'asc', missing: '_first' } }],
    datasets_desc: [
      { datasetsPercentage: { order: 'desc', missing: '_last' } },
    ],
    protocols_asc: [
      { protocolsPercentage: { order: 'asc', missing: '_first' } },
    ],
    protocols_desc: [
      { protocolsPercentage: { order: 'desc', missing: '_last' } },
    ],
    code_asc: [{ codePercentage: { order: 'asc', missing: '_first' } }],
    code_desc: [{ codePercentage: { order: 'desc', missing: '_last' } }],
    lab_materials_asc: [
      { labMaterialsPercentage: { order: 'asc', missing: '_first' } },
    ],
    lab_materials_desc: [
      { labMaterialsPercentage: { order: 'desc', missing: '_last' } },
    ],
  };

export const getPublicationCompliance = async (
  opensearchClient: OpensearchClient<PublicationComplianceOpensearchResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortPublicationCompliance>,
): Promise<ListPublicationComplianceOpensearchResponse | undefined> =>
  searchCompliance<
    PublicationComplianceOpensearchResponse,
    SortPublicationCompliance,
    ListPublicationComplianceOpensearchResponse
  >(opensearchClient, options, publicationComplianceOpensearchSort);
