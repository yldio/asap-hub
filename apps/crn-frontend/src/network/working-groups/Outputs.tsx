import {
  SearchFrame,
  createCsvFileStream,
  resultsToStream,
} from '@asap-hub/frontend-utils';
import {
  FetchResearchOutputsFilter,
  ResearchOutputResponse,
  WorkingGroupDataObject,
} from '@asap-hub/model';
import {
  ProfileOutputs,
  utils,
  ResearchOutputsSearch,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { format } from 'date-fns';
import { ComponentProps } from 'react';
import { useRecoilValue } from 'recoil';

import { authorizationState } from '../../auth/state';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
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
import { useResearchOutputs } from '../../shared-research/state';

type OutputsListProps = Pick<
  ComponentProps<typeof ProfileOutputs>,
  'userAssociationMember'
> & {
  displayName: string;
  searchQuery: string;
  filtersMap: FetchResearchOutputsFilter;
  workingGroupId: string;
  draftOutputs?: boolean;
  hasOutputs: boolean;
};
type OutputsProps = {
  workingGroup: WorkingGroupDataObject;
  draftOutputs?: boolean;
  userAssociationMember: boolean;
};

const OutputsList: React.FC<OutputsListProps> = ({
  workingGroupId,
  userAssociationMember,
  searchQuery,
  filtersMap,
  draftOutputs,
  displayName,
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
          workingGroupId,
          draftsOnly: draftOutputs,
        }
      : {
          workingGroupId,
        }),
  });
  const { client } = useAlgolia();
  const authorization = useRecoilValue(authorizationState);
  const exportResults = () =>
    draftOutputs
      ? squidexResultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_Drafts_WorkingGroup_${utils
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
                workingGroupId,
                draftsOnly: true,
                ...paginationParams,
              },
              authorization,
            ),
          researchOutputToCSV,
        )
      : resultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_WorkingGroup_${utils
              .titleCase(displayName)
              .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
            { header: true },
          ),
          (paginationParams) =>
            getResearchOutputs(client, {
              documentType: filtersMap.documentType,
              source: filtersMap.source,
              searchQuery,
              workingGroupId,
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

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <ProfileOutputs
      algoliaIndexName={result.algoliaIndexName}
      algoliaQueryId={result.algoliaQueryId}
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .outputs({}).$ + listViewParams
      }
      userAssociationMember={userAssociationMember}
      workingGroupAssociation
      exportResults={exportResults}
      draftOutputs={draftOutputs}
      hasOutputs={hasOutputs}
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({
  workingGroup,
  draftOutputs,
  userAssociationMember,
}) => {
  const {
    filters,
    filtersMap,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch(['source', 'documentType']);
  const { pageSize } = usePaginationParams();
  const hasOutputs = !!useResearchOutputs({
    searchQuery: '',
    currentPage: 0,
    pageSize,
    workingGroupId: workingGroup.id,
  }).total;
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
          draftOutputs={draftOutputs}
          workingGroupId={workingGroup.id}
          searchQuery={debouncedSearchQuery}
          filtersMap={filtersMap}
          displayName={workingGroup.title}
          userAssociationMember={userAssociationMember}
          hasOutputs={hasOutputs}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;
