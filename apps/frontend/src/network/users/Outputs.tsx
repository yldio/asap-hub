import {
  UserProfileResearchOutputs,
  UserProfileSearchAndFilter,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';
import { ComponentProps, FC } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { getResearchOutputs } from '../../shared-research/api';
import {
  algoliaResultsToStream,
  createCsvFileStream,
  researchOutputToCSV,
} from '../../shared-research/export';
import { useResearchOutputs } from '../../shared-research/state';
import { SearchFrame } from '../../structure/Frame';
import { useUserById } from './state';

type OutputsListProps = Pick<
  ComponentProps<typeof UserProfileResearchOutputs>,
  'hasOutputs' | 'ownUser' | 'firstName'
> & {
  searchQuery: string;
  filters: Set<string>;
  userId: string;
};

type OutputsProps = {
  userId: string;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  userId,
  firstName,
  hasOutputs,
  ownUser,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    userId,
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
          userId,
          ...paginationParams,
        }),
      researchOutputToCSV,
    );
  return (
    <UserProfileResearchOutputs
      exportResults={exportResults}
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({}).users({}).user({ userId }).outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({}).users({}).user({ userId }).outputs({}).$ + listViewParams
      }
      ownUser={ownUser}
      hasOutputs={hasOutputs}
      firstName={firstName}
    />
  );
};

const Outputs: FC<OutputsProps> = ({ userId }) => {
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
    userId,
  }).total;
  const ownUser = useCurrentUser()?.id === userId;
  const firstName = useUserById(userId)?.firstName;
  return (
    <article>
      {hasOutputs && (
        <UserProfileSearchAndFilter
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        />
      )}
      <SearchFrame title="">
        <OutputsList
          userId={userId}
          searchQuery={debouncedSearchQuery}
          filters={filters}
          hasOutputs={hasOutputs}
          ownUser={ownUser}
          firstName={firstName}
        />
      </SearchFrame>
    </article>
  );
};

export default Outputs;
