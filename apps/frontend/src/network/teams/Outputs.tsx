import {
  TeamProfileOutputs,
  ResearchOutputsSearch,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';
import { useCurrentUser } from '@asap-hub/react-context';
import { ComponentProps } from 'react';

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
import { useTeamById } from './state';

type OutputsListProps = Pick<
  ComponentProps<typeof TeamProfileOutputs>,
  'hasOutputs' | 'ownTeam' | 'contactEmail'
> & {
  searchQuery: string;
  filters: Set<string>;
  teamId: string;
};
type OutputsProps = {
  teamId: string;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  teamId,
  hasOutputs,
  ownTeam,
  contactEmail,
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
      researchOutputs={result.items}
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
      hasOutputs={hasOutputs}
      ownTeam={ownTeam}
      contactEmail={contactEmail}
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ teamId }) => {
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const hasOutputs = !!useResearchOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
    teamId,
  }).total;

  const contactEmail = useTeamById(teamId)?.pointOfContact?.email;

  const ownTeam = !!(useCurrentUser()?.teams ?? []).filter(
    ({ id }) => id === teamId,
  ).length;
  return (
    <article>
      {hasOutputs && (
        <ResearchOutputsSearch
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        />
      )}
      <SearchFrame title="">
        <OutputsList
          teamId={teamId}
          searchQuery={debouncedSearchQuery}
          filters={filters}
          hasOutputs={hasOutputs}
          ownTeam={ownTeam}
          contactEmail={contactEmail}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;
