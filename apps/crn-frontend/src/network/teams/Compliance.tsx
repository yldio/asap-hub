import {
  algoliaResultsToStream,
  createCsvFileStream,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import {
  CompletedStatusOption,
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  DEFAULT_COMPLETED_STATUS,
  ManuscriptPutRequest,
  ManuscriptStatus,
  PartialManuscriptResponse,
  SortCompliance,
  RequestedAPCCoverageOption,
  DEFAULT_REQUESTED_APC_COVERAGE,
} from '@asap-hub/model';
import {
  ComplianceControls,
  ComplianceDashboard,
  ManuscriptByStatus,
  SearchField,
} from '@asap-hub/react-components';
import { format } from 'date-fns';
import { ComponentProps, useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { useAssignedUsersSuggestions } from '../../shared-state/shared-research';
import { getManuscripts } from './api';
import { manuscriptToCSV } from './export';
import {
  useDownloadFullComplianceDataset,
  useIsComplianceReviewer,
  useManuscripts,
  usePutManuscript,
} from './state';
import { useComplianceSearch } from './useComplianceSearch';
import { useManuscriptToast } from './useManuscriptToast';
import { useComplianceSearch as useComplianceOSearch } from '../../opensearch/state';

// Helper function to build APC coverage filter
const getAPCCoverageFilter = (
  requestedAPCCoverage: RequestedAPCCoverageOption,
) => {
  if (!requestedAPCCoverage || requestedAPCCoverage === 'all') {
    return undefined; // No filter
  }

  switch (requestedAPCCoverage) {
    case 'apcNotRequested':
      return { term: { apcRequested: false } };
    case 'apcRequested':
      return { term: { apcRequested: true } };
    case 'paid':
      return {
        bool: {
          must: [
            { term: { apcRequested: true } },
            { term: { apcCoverageRequestStatus: 'paid' } },
          ],
        },
      };
    case 'notPaid':
      return {
        bool: {
          must: [
            { term: { apcRequested: true } },
            { term: { apcCoverageRequestStatus: 'notPaid' } },
          ],
        },
      };
    case 'declined':
      return {
        bool: {
          must: [
            { term: { apcRequested: true } },
            { term: { apcCoverageRequestStatus: 'declined' } },
          ],
        },
      };
    default:
      return undefined;
  }
};

// Helper function to build status filters
const getStatusFilters = (
  completedStatus: CompletedStatusOption,
  selectedStatuses: ManuscriptStatus[],
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mustNotConditions: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mustConditions: any[] = [];

  // Handle completed status filter (hide/show Compliant and Closed)
  if (completedStatus === 'hide') {
    mustNotConditions.push({
      terms: {
        status: ['Closed (other)', 'Compliant'],
      },
    });
  }

  // Handle selected statuses filter
  if (selectedStatuses.length > 0) {
    mustConditions.push({
      terms: {
        status: selectedStatuses,
      },
    });
  }

  return { mustNotConditions, mustConditions };
};

// Function to build OpenSearch query
const buildOpenSearchQuery = (
  searchQuery: string,
  requestedAPCCoverage: RequestedAPCCoverageOption,
  completedStatus: CompletedStatusOption,
  selectedStatuses: ManuscriptStatus[],
) => {
  // Build APC coverage filter
  const apcFilter = getAPCCoverageFilter(requestedAPCCoverage);

  // Build status filters
  const { mustNotConditions, mustConditions } = getStatusFilters(
    completedStatus,
    selectedStatuses,
  );

  // Add APC filter to must conditions if it exists
  if (apcFilter) {
    mustConditions.push(apcFilter);
  }

  // Add search query to must conditions if provided
  if (searchQuery.trim()) {
    mustConditions.push({
      multi_match: {
        query: searchQuery,
        fields: ['title', 'teams.name', 'assignedUsers.name'],
      },
    });
  }

  // Build the complete OpenSearch query
  if (mustNotConditions.length === 0 && mustConditions.length === 0) {
    // No conditions at all - use match_all
    return { match_all: {} };
  }
  // Build bool query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boolQuery: any = { bool: {} };

  if (mustNotConditions.length > 0) {
    boolQuery.bool.must_not = mustNotConditions;
  }

  if (mustConditions.length > 0) {
    boolQuery.bool.must = mustConditions;
  }

  return boolQuery;
};

type ComplianceListProps = Pick<
  ComponentProps<typeof ComplianceControls>,
  'completedStatus'
> & {
  selectedStatuses: ManuscriptStatus[];
  requestedAPCCoverage: RequestedAPCCoverageOption;
  isComplianceReviewer: boolean;
  searchQuery: string;
  pageSize: number;
  currentPage: number;
  generateLinkFactory: ReturnType<
    typeof useComplianceSearch
  >['generateLinkFactory'];
};

const ComplianceList: React.FC<ComplianceListProps> = ({
  searchQuery,
  pageSize,
  currentPage,
  requestedAPCCoverage,
  completedStatus,
  selectedStatuses,
  isComplianceReviewer,
  generateLinkFactory,
}) => {
  const { client } = useAlgolia();

  const result = useManuscripts({
    searchQuery,
    currentPage,
    pageSize,
    requestedAPCCoverage,
    completedStatus,
    selectedStatuses,
  });

  // Build OpenSearch query for the current filters
  const opensearchQuery = buildOpenSearchQuery(
    searchQuery,
    requestedAPCCoverage,
    completedStatus,
    selectedStatuses,
  );

  // Use OpenSearch with the pre-built query
  const { total, results } = useComplianceOSearch({
    query: opensearchQuery,
    size: pageSize,
    from: currentPage * pageSize,
  });

  // eslint-disable-next-line no-console
  console.log('opensearch data', { total, results });
  const { setFormType } = useManuscriptToast();

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  const hasAppliedFilters =
    selectedStatuses.length > 0 ||
    searchQuery.trim() !== '' ||
    completedStatus !== DEFAULT_COMPLETED_STATUS ||
    requestedAPCCoverage !== DEFAULT_REQUESTED_APC_COVERAGE;

  const updateManuscript = usePutManuscript();
  const getComplianceDatasetLink = useDownloadFullComplianceDataset();
  const getComplianceDataset = async () => {
    const presignedUrl = await getComplianceDatasetLink();
    window.open(presignedUrl, '_self');
  };

  const handleUpdateManuscript = async (
    id: string,
    manuscript: ManuscriptPutRequest,
  ) => {
    const manuscriptResponse = await updateManuscript(id, manuscript);
    result.refresh(manuscriptResponse);
    setFormType({ type: 'assigned-users', accent: 'successLarge' });
    return manuscriptResponse;
  };

  const getAssignedUsersSuggestions = useAssignedUsersSuggestions();
  const [sort, setSort] = useState<SortCompliance>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<ComplianceSortingDirection>(complianceInitialSortingDirection);
  const href = renderPageHref(currentPage);

  const exportResults = () =>
    algoliaResultsToStream<PartialManuscriptResponse>(
      createCsvFileStream(`manuscripts_${format(new Date(), 'yyMMdd')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getManuscripts(client, {
          searchQuery,
          requestedAPCCoverage,
          completedStatus,
          selectedStatuses,
          ...paginationParams,
        }),
      manuscriptToCSV,
    );

  return (
    <article>
      <ComplianceControls
        exportResults={exportResults}
        getComplianceDataset={getComplianceDataset}
        generateLink={generateLinkFactory(
          href,
          currentPage,
          selectedStatuses,
          searchQuery,
        )}
        manuscriptCount={result.total}
        completedStatus={completedStatus as CompletedStatusOption}
        requestedAPCCoverage={
          requestedAPCCoverage as RequestedAPCCoverageOption
        }
      />
      <ComplianceDashboard
        hasAppliedFilters={hasAppliedFilters}
        isComplianceReviewer={isComplianceReviewer}
        data={result.items}
        setSort={setSort}
        setSortingDirection={setSortingDirection}
        sort={sort}
        sortingDirection={sortingDirection}
        currentPageIndex={currentPage}
        numberOfPages={numberOfPages}
        renderPageHref={renderPageHref}
        onUpdateManuscript={handleUpdateManuscript}
        getAssignedUsersSuggestions={(input) =>
          getAssignedUsersSuggestions(input).then((authors) =>
            authors.map((author) => ({
              author,
              label: author.displayName,
              value: author.id,
            })),
          )
        }
      />
    </article>
  );
};

const Compliance: React.FC = () => {
  const {
    completedStatus,
    debouncedSearchQuery,
    requestedAPCCoverage,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setStatus,
    generateLinkFactory,
  } = useComplianceSearch();

  const { currentPage, pageSize } = usePaginationParams();

  const isComplianceReviewer = useIsComplianceReviewer();

  return (
    <article>
      <SearchField
        placeholder="Enter team name, ID, assigned users..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <ManuscriptByStatus
        shouldHideCompleteStatus={completedStatus === 'hide'}
        isComplianceReviewer={isComplianceReviewer}
        selectedStatuses={selectedStatuses}
        onSelectStatus={setStatus}
      />
      <SearchFrame title="Compliance">
        <ComplianceList
          generateLinkFactory={generateLinkFactory}
          isComplianceReviewer={isComplianceReviewer}
          searchQuery={debouncedSearchQuery}
          pageSize={pageSize}
          currentPage={currentPage}
          requestedAPCCoverage={requestedAPCCoverage}
          completedStatus={completedStatus}
          selectedStatuses={selectedStatuses}
        />
      </SearchFrame>
    </article>
  );
};

export default Compliance;
