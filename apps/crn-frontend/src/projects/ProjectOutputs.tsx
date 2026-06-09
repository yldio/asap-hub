import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { NoOutputsPage, ProjectOutputList } from '@asap-hub/react-components';

import { usePagination, usePaginationParams } from '../hooks';
import { useResearchOutputs } from '../shared-research/state';
import { getProjectResearchOutputListScope } from './projectResearchOutputScope';
import { researchOutputToProjectOutput } from './researchOutputToProjectOutput';

type ProjectOutputsProps = {
  projectId: string;
  teamId?: string;
  draftOutputs?: boolean;
  userAssociationMember: boolean;
};

const ProjectOutputs: React.FC<ProjectOutputsProps> = ({
  projectId,
  teamId,
  draftOutputs = false,
  userAssociationMember,
}) => {
  const location = useLocation();
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const listScope = getProjectResearchOutputListScope({ projectId, teamId });
  const listOptions = {
    searchQuery: '',
    filters: new Set<string>(),
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

  if (result.total === 0) {
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

export default ProjectOutputs;
