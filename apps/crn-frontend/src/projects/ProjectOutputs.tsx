import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { NoOutputsPage, ProjectOutputList } from '@asap-hub/react-components';

import { usePagination, usePaginationParams } from '../hooks';
import {
  createProjectOutputsMock,
  createProjectDraftOutputsMock,
} from './projectOutputs.mock';

type ProjectOutputsProps = {
  projectId: string;
  projectTitle: string;
  draftOutputs?: boolean;
};

const ProjectOutputs: React.FC<ProjectOutputsProps> = ({
  projectId,
  projectTitle,
  draftOutputs = false,
}) => {
  const location = useLocation();
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const researchOutputs = useMemo(
    () =>
      draftOutputs
        ? createProjectDraftOutputsMock(projectId, projectTitle)
        : createProjectOutputsMock(projectId, projectTitle),
    [projectId, projectTitle, draftOutputs],
  );

  const total = researchOutputs.length;
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  if (total === 0) {
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

  const pageItems = researchOutputs.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  return (
    <ProjectOutputList
      researchOutputs={pageItems}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={location.pathname + cardViewParams}
      listViewHref={location.pathname + listViewParams}
      exportResults={() => Promise.resolve()}
      showTags
    />
  );
};

export default ProjectOutputs;
