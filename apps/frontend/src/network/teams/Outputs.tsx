import {
  SharedResearchList,
  TeamProfileOutputs,
  TeamProfileOutputsHeader,
} from '@asap-hub/react-components';
import { ResearchOutputResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';
import { SearchFrame } from '../../structure/Frame';

type OutputsListProps = {
  searchQuery: string;
  filters: Set<string>;
  teamId: string;
};
type OutputsProps = {
  teamId: string;
  teamOutputs: ReadonlyArray<ResearchOutputResponse>;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  teamId,
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
  return (
    <SharedResearchList
      researchOutputs={result.items}
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
    <>
      {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') && (
        <TeamProfileOutputsHeader
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        />
      )}
      <TeamProfileOutputs outputs={teamOutputs}>
        {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') && (
          <SearchFrame title="outputs">
            <OutputsList
              teamId={teamId}
              searchQuery={debouncedSearchQuery}
              filters={filters}
            />
          </SearchFrame>
        )}
      </TeamProfileOutputs>
    </>
  );
};
export default Outputs;
