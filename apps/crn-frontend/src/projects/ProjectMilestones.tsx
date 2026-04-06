import { SearchFrame } from '@asap-hub/frontend-utils';
import { GrantType } from '@asap-hub/model';
import {
  ProjectDetailMilestones,
  ProjectMilestonesTable,
  ResearchOutputOption,
} from '@asap-hub/react-components';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePagination, usePaginationParams } from '../hooks';
import { useFetchMilestoneArticles } from './articles-state';
import { useProjectMilestones } from './state';

type TableContentProps = {
  projectId: string;
  selectedGrantType: GrantType;
  isLead: boolean;
  loadArticleOptions: (inputValue: string) => Promise<ResearchOutputOption[]>;
};

const ProjectMilestonesTableContent: React.FC<TableContentProps> = ({
  projectId,
  selectedGrantType,
  isLead,
  loadArticleOptions,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items: milestones = [], total } = useProjectMilestones({
    projectId,
    grantType: selectedGrantType,
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  const fetchArticles = useFetchMilestoneArticles();

  return (
    <ProjectMilestonesTable
      milestones={milestones}
      pageControlsProps={{
        numberOfPages,
        currentPageIndex: currentPage,
        renderPageHref,
      }}
      fetchLinkedArticles={fetchArticles}
      isLead={isLead}
      loadArticleOptions={loadArticleOptions}
      selectedGrantType={selectedGrantType}
    />
  );
};

const ProjectMilestones: React.FC<{
  projectId: string;
  isLead: boolean;
  loadArticleOptions: (inputValue: string) => Promise<ResearchOutputOption[]>;
  hasSupplementGrant: boolean;
  seeAimsHref?: string;
}> = ({
  projectId,
  hasSupplementGrant,
  seeAimsHref,
  isLead,
  loadArticleOptions,
}) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  // const params = new URLSearchParams(location.search);

  // const selectedGrantType =
  //   (params.get('grantType') as GrantType) ??
  //   (hasSupplementGrant ? 'supplement' : 'original');
  const [selectedGrantType, setSelectedGrantType] = useState<GrantType>(
    hasSupplementGrant ? 'supplement' : 'original',
  );

  // const { items: milestones = [], total } = useProjectMilestones({
  //   projectId,
  //   grantType: selectedGrantType,
  //   searchQuery: '',
  //   filters: new Set(),
  //   currentPage,
  //   pageSize,
  // });

  // const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  // const fetchArticles = useFetchMilestoneArticles();

  const handleGrantTypeChange = useCallback(
    (grantType: GrantType) => {
      setSelectedGrantType(grantType);
      const newParams = new URLSearchParams(search);
      newParams.set('grantType', grantType);
      newParams.delete('currentPage');
      void navigate({ search: `${newParams.toString()}` }, { replace: true });
    },
    [search, navigate],
  );

  return (
    <ProjectDetailMilestones
      hasSupplementGrant={hasSupplementGrant}
      seeAimsHref={seeAimsHref}
      selectedGrantType={selectedGrantType}
      onGrantTypeChange={handleGrantTypeChange}
    >
      <SearchFrame title="Project Milestones">
        {/* <ProjectMilestonesTable
          milestones={milestones}
          pageControlsProps={{
            numberOfPages,
            currentPageIndex: currentPage,
            renderPageHref,
          }}
          fetchLinkedArticles={fetchArticles}
          isLead={isLead}
          loadArticleOptions={loadArticleOptions}
          selectedGrantType={selectedGrantType}
        /> */}
        <ProjectMilestonesTableContent
          projectId={projectId}
          selectedGrantType={selectedGrantType}
          isLead={isLead}
          loadArticleOptions={loadArticleOptions}
        />
      </SearchFrame>
    </ProjectDetailMilestones>
  );
};

export default ProjectMilestones;
