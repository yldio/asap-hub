import { RESEARCH_OUTPUT_ENTITY_TYPE } from '@asap-hub/algolia';
import { SearchFrame, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
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
  algoliaResultsToStream,
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
  filters: Set<string>;
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
  filters,
  draftOutputs,
  displayName,
  hasOutputs,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    filters,
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
                filters,
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
      : algoliaResultsToStream<typeof RESEARCH_OUTPUT_ENTITY_TYPE>(
          createCsvFileStream(
            `SharedOutputs_WorkingGroup_${utils
              .titleCase(displayName)
              .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
            { header: true },
          ),
          (paginationParams) =>
            getResearchOutputs(client, {
              filters,
              searchQuery,
              workingGroupId,
              ...paginationParams,
            }),
          researchOutputToCSV,
        );

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <ProfileOutputs
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
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();
  const { pageSize } = usePaginationParams();
  const hasOutputs = !!useResearchOutputs({
    searchQuery: '',
    filters: new Set(),
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
          filters={filters}
          displayName={workingGroup.title}
          userAssociationMember={userAssociationMember}
          hasOutputs={hasOutputs}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;
