import { useMemo } from 'react';
import { useLocation } from 'react-router';
import {
  NoOutputsPage,
  ProjectOutputList,
  ResearchOutputsSearch,
  outputTypeFilters,
  utils,
} from '@asap-hub/react-components';
import {
  SearchFrame,
  resultsToStream,
  createCsvFileStream,
} from '@asap-hub/frontend-utils';
import {
  FetchResearchOutputsFilter,
  ResearchOutputResponse,
} from '@asap-hub/model';
import format from 'date-fns/format';
import { useRecoilValue } from 'recoil';

import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useResearchOutputs } from '../shared-research/state';
import { getProjectResearchOutputListScope } from './projectResearchOutputScope';
import { researchOutputToProjectOutput } from './researchOutputToProjectOutput';
import { useAlgolia } from '../hooks/algolia';
import { authorizationState } from '../auth/state';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../shared-research/api';
import {
  MAX_ALGOLIA_RESULTS,
  researchOutputToCSV,
} from '../shared-research/export';

type ProjectOutputsProps = {
  projectId: string;
  projectTitle: string;
  teamId?: string;
  draftOutputs?: boolean;
  userAssociationMember: boolean;
  hasOutputs: boolean;
};

type OutputsListProps = {
  searchQuery: string;
  filtersMap: FetchResearchOutputsFilter;
  projectId: string;
  projectTitle: string;
  teamId?: string;
  userAssociationMember: boolean;
  draftOutputs?: boolean;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filtersMap,
  teamId,
  projectId,
  projectTitle,
  userAssociationMember,
  draftOutputs,
}) => {
  const location = useLocation();
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const listScope = getProjectResearchOutputListScope({ projectId, teamId });
  const listOptions = {
    searchQuery,
    documentType: filtersMap.documentType,
    source: filtersMap.source,
    currentPage,
    pageSize,
    ...listScope,
  };

  const { client } = useAlgolia();
  const authorization = useRecoilValue(authorizationState);
  const exportResults = () =>
    draftOutputs
      ? resultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_Drafts_Project_${utils
              .titleCase(projectTitle)
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
                draftsOnly: true,
                ...listScope,
                ...paginationParams,
              },
              authorization,
            ),
          researchOutputToCSV,
        )
      : resultsToStream<ResearchOutputResponse>(
          createCsvFileStream(
            `SharedOutputs_Project_${utils
              .titleCase(projectTitle)
              .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
            { header: true },
          ),
          (paginationParams) =>
            getResearchOutputs(client, {
              documentType: filtersMap.documentType,
              source: filtersMap.source,
              searchQuery,
              ...listScope,
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

  const result = useResearchOutputs(
    draftOutputs
      ? { ...listOptions, draftsOnly: true as const, userAssociationMember }
      : listOptions,
  );

  const researchOutputs = useMemo(
    () => result.items.map(researchOutputToProjectOutput),
    [result.items],
  );

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <ProjectOutputList
      researchOutputs={researchOutputs}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={location.pathname + cardViewParams}
      listViewHref={location.pathname + listViewParams}
      exportResults={exportResults}
      showTags
    />
  );
};

const ProjectOutputs: React.FC<ProjectOutputsProps> = ({
  projectId,
  projectTitle,
  teamId,
  draftOutputs = false,
  userAssociationMember,
  hasOutputs,
}) => {
  const {
    filters,
    filtersMap,
    toggleFilter,
    setSearchQuery,
    searchQuery,
    debouncedSearchQuery,
  } = useSearch(['documentType']);

  if (!hasOutputs) {
    return (
      <NoOutputsPage
        title={
          draftOutputs ? 'No draft outputs available.' : 'No outputs available.'
        }
        description={
          draftOutputs
            ? 'When this project shares a draft output, it will be listed here.'
            : 'When this project shares an output, it will be listed here.'
        }
        hideExploreButton
      />
    );
  }

  return (
    <>
      <ResearchOutputsSearch
        onChangeSearch={setSearchQuery}
        searchQuery={searchQuery}
        onChangeFilter={toggleFilter}
        filters={filters}
        filterOptions={outputTypeFilters}
      />
      <SearchFrame title="">
        <OutputsList
          draftOutputs={draftOutputs}
          teamId={teamId}
          projectId={projectId}
          projectTitle={projectTitle}
          searchQuery={debouncedSearchQuery}
          filtersMap={filtersMap}
          userAssociationMember={userAssociationMember}
        />
      </SearchFrame>
    </>
  );
};

export default ProjectOutputs;
