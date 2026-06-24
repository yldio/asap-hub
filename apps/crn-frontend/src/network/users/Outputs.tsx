import {
  resultsToStream,
  createCsvFileStream,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import {
  FetchResearchOutputsFilter,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import {
  UserProfileResearchOutputs,
  UserProfileSearchAndFilter,
  utils,
} from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';
import { ComponentProps, FC } from 'react';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { getResearchOutputs } from '../../shared-research/api';
import {
  MAX_ALGOLIA_RESULTS,
  researchOutputToCSV,
} from '../../shared-research/export';
import { useResearchOutputs } from '../../shared-research/state';
import { useUserById } from './state';

type OutputsListProps = Pick<
  ComponentProps<typeof UserProfileResearchOutputs>,
  'hasOutputs' | 'ownUser' | 'firstName'
> &
  Pick<UserResponse, 'lastName'> & {
    searchQuery: string;
    filtersMap: FetchResearchOutputsFilter;
    userId: string;
  };

type OutputsProps = {
  userId: string;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filtersMap,
  userId,
  firstName,
  lastName,
  hasOutputs,
  ownUser,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    documentType: filtersMap.documentType,
    source: filtersMap.source,
    currentPage,
    pageSize,
    userId,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  const { client } = useAlgolia();
  const exportResults = () =>
    resultsToStream<ResearchOutputResponse>(
      createCsvFileStream(
        `SharedOutputs_${utils.titleCase(firstName)}${utils.titleCase(
          lastName,
        )}_${format(new Date(), 'MMddyy')}.csv`,
        { header: true },
      ),
      (paginationParams) =>
        getResearchOutputs(client, {
          documentType: filtersMap.documentType,
          source: filtersMap.source,
          searchQuery,
          userId,
          ...paginationParams,
        }).then((response) => ({
          items: response.hits,
          total: response.nbHits ?? 0,
          algoliaIndexName: response.index,
          algoliaQueryId: response.queryID,
        })),
      researchOutputToCSV,
      MAX_ALGOLIA_RESULTS,
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
    filtersMap,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch(['source', 'documentType']);
  const { currentPage, pageSize } = usePaginationParams();
  const hasOutputs = !!useResearchOutputs({
    searchQuery: '',
    currentPage,
    pageSize,
    userId,
  }).total;
  const ownUser = useCurrentUserCRN()?.id === userId;
  const user = useUserById(userId);
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
          filtersMap={filtersMap}
          hasOutputs={hasOutputs}
          ownUser={ownUser}
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
        />
      </SearchFrame>
    </article>
  );
};

export default Outputs;
