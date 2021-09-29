import {
  TeamProfileOutputs,
  ResearchOutputsSearch,
} from '@asap-hub/react-components';
import { ResearchOutputResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';
import { SearchFrame } from '../../structure/Frame';
import {
  algoliaResultsToStream,
  createCsvFileStream,
  researchOutputToCSV,
} from '../../shared-research/export';
import { getResearchOutputs } from '../../shared-research/api';
import { useAlgolia } from '../../hooks/algolia';

type OutputsListProps = {
  searchQuery: string;
  filters: Set<string>;
  teamId: string;
  teamOutputs: ReadonlyArray<ResearchOutputResponse>;
};
type OutputsProps = {
  teamId: string;
  teamOutputs: ReadonlyArray<ResearchOutputResponse>;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  teamId,
  teamOutputs,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    teamId,
  });
  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  const { index } = useAlgolia();
  const exportResults = () =>
    algoliaResultsToStream(
      createCsvFileStream(
        { headers: true },
        `SharedOutputs_${format(new Date(), 'MMddyy')}.csv`,
      ),
      (paginationParams) =>
        getResearchOutputs(index, {
          filters,
          searchQuery,
          teamId,
          ...paginationParams,
        }),
      researchOutputToCSV,
    );
  return (
    <TeamProfileOutputs
      researchOutputs={
        isEnabled('ALGOLIA_RESEARCH_OUTPUTS') ? result.items : teamOutputs
      }
      exportResults={exportResults}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + listViewParams
      }
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ teamOutputs, teamId }) => {
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();

  return (
    <article>
      {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') && (
        <ResearchOutputsSearch
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        />
      )}
      <SearchFrame title="outputs">
        <OutputsList
          teamId={teamId}
          teamOutputs={teamOutputs}
          searchQuery={debouncedSearchQuery}
          filters={filters}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;
