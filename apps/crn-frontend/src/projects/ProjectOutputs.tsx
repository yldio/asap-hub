import { useMemo } from 'react';
import { useLocation } from 'react-router';
import {
  NoOutputsPage,
  ProjectOutputList,
  ResearchOutputsSearch,
  outputTypeFilters,
} from '@asap-hub/react-components';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { FetchResearchOutputsFilter } from '@asap-hub/model';

import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useResearchOutputs } from '../shared-research/state';
import { getProjectResearchOutputListScope } from './projectResearchOutputScope';
import { researchOutputToProjectOutput } from './researchOutputToProjectOutput';

type ProjectOutputsProps = {
  projectId: string;
  teamId?: string;
  draftOutputs?: boolean;
  userAssociationMember: boolean;
  hasOutputs: boolean;
};

type OutputsListProps = {
  searchQuery: string;
  filtersMap: FetchResearchOutputsFilter;
  projectId: string;
  teamId?: string;
  userAssociationMember: boolean;
  draftOutputs?: boolean;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filtersMap,
  teamId,
  projectId,
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
      exportResults={/* istanbul ignore next */ () => Promise.resolve()}
      showTags
    />
  );
};

const ProjectOutputs: React.FC<ProjectOutputsProps> = ({
  projectId,
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
          searchQuery={debouncedSearchQuery}
          filtersMap={filtersMap}
          userAssociationMember={userAssociationMember}
        />
      </SearchFrame>
    </>
  );
};

export default ProjectOutputs;
