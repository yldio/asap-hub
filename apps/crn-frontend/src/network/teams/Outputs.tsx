import {
  resultsToStream,
  createCsvFileStream,
  SearchFrame,
} from '@asap-hub/frontend-utils';
import {
  ProfileOutputs,
  ResearchOutputsSearch,
  utils,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';
import { ComponentProps } from 'react';
import {
  FetchResearchOutputsFilter,
  ResearchOutputResponse,
  TeamResponse,
} from '@asap-hub/model';
import { useRecoilValue } from 'recoil';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

import { useAlgolia } from '../../hooks/algolia';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../shared-research/api';
import {
  MAX_ALGOLIA_RESULTS,
  researchOutputToCSV,
  squidexResultsToStream,
} from '../../shared-research/export';
import { authorizationState } from '../../auth/state';

type OutputsListProps = Pick<
  ComponentProps<typeof ProfileOutputs>,
  'userAssociationMember' | 'contactEmail'
> & {
  displayName: string;
  searchQuery: string;
  filtersMap: FetchResearchOutputsFilter;
  teamId: string;
  userAssociationMember: boolean;
  draftOutputs?: boolean;
  hasOutputs: boolean;
};
type OutputsProps = {
  team: TeamResponse;
  draftOutputs?: boolean;
  userAssociationMember: boolean;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filtersMap,
  teamId,
  userAssociationMember,
  contactEmail,
  displayName,
  draftOutputs,
  hasOutputs,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    documentType: filtersMap.documentType,
    source: filtersMap.source,
    currentPage,
    pageSize,
    ...(draftOutputs
      ? {
          userAssociationMember,
          teamId,
          draftsOnly: true,
        }
      : {
          teamId,
        }),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  const { client } = useAlgolia();
  const authorization = useRecoilValue(authorizationState);
  const exportResults = () =>
    draftOutputs
      ? squidexResultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_Drafts_Team_${utils
              .titleCase(displayName)
              .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
            { header: true },
          ),
          (paginationParams) =>
            getDraftResearchOutputs(
              {
                documentType: filtersMap.documentType,
                source: filtersMap.source,
                searchQuery,
                userAssociationMember,
                teamId,
                draftsOnly: true,
                ...paginationParams,
              },
              authorization,
            ),
          researchOutputToCSV,
        )
      : resultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_Team_${utils
              .titleCase(displayName)
              .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
            { header: true },
          ),
          (paginationParams) =>
            getResearchOutputs(client, {
              documentType: filtersMap.documentType,
              source: filtersMap.source,
              searchQuery,
              teamId,
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
    <ProfileOutputs
      algoliaIndexName={result.algoliaIndexName}
      algoliaQueryId={result.algoliaQueryId}
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
      userAssociationMember={userAssociationMember}
      contactEmail={contactEmail}
      workingGroupAssociation={false}
      draftOutputs={draftOutputs}
      hasOutputs={hasOutputs}
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({
  team,
  userAssociationMember,
  draftOutputs,
}) => {
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
    teamId: team.id,
  }).total;

  return (
    <article style={{ display: 'flex', flexFlow: 'column', gap: 48 }}>
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
          draftOutputs={draftOutputs}
          teamId={team.id}
          searchQuery={debouncedSearchQuery}
          filtersMap={filtersMap}
          userAssociationMember={userAssociationMember}
          contactEmail={team?.pointOfContact}
          displayName={team?.displayName ?? ''}
          hasOutputs={hasOutputs}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;
