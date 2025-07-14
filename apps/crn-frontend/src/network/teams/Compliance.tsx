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
    console.log('in');
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
