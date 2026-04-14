import { SearchFrame } from '@asap-hub/frontend-utils';
import { Aim, GrantType } from '@asap-hub/model';
import {
  LabeledMultiSelect,
  ProjectDetailMilestones,
  ProjectMilestonesTable,
  ResearchOutputOption,
} from '@asap-hub/react-components';
import { ComponentProps, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useManuscriptToast } from '../network/teams/useManuscriptToast';
import { usePagination, usePaginationParams } from '../hooks';
import { useFetchMilestoneArticles } from './articles-state';
import { useCreateProjectMilestone, useProjectMilestones } from './state';

type TableContentProps = {
  projectId: string;
  selectedGrantType: GrantType;
  isLead: boolean;
  loadArticleOptions: NonNullable<
    ComponentProps<
      typeof LabeledMultiSelect<ResearchOutputOption>
    >['loadOptions']
  >;
};

const ProjectMilestonesTableContent: React.FC<TableContentProps> = ({
  projectId,
  selectedGrantType,
  isLead,
  loadArticleOptions,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const filters = useMemo(() => new Set<string>(), []);
  const { items: milestones = [], total } = useProjectMilestones({
    projectId,
    grantType: selectedGrantType,
    searchQuery: '',
    filters,
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
  readonly projectId: string;
  readonly isLead: boolean;
  readonly hasSupplementGrant: boolean;
  readonly aims: ReadonlyArray<Aim>;
  readonly seeAimsHref?: string;
  milestonesLastUpdated?: Partial<Record<GrantType, string>>;
  readonly teamId?: string;
  readonly loadArticleOptions: NonNullable<
    ComponentProps<
      typeof LabeledMultiSelect<ResearchOutputOption>
    >['loadOptions']
  >;
}> = ({
  projectId,
  hasSupplementGrant,
  seeAimsHref,
  aims,
  isLead,
  loadArticleOptions,
  milestonesLastUpdated,
}) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const selectedGrantType =
    (params.get('grantType') as GrantType) ??
    (hasSupplementGrant ? 'supplement' : 'original');

  const handleGrantTypeChange = useCallback(
    (grantType: GrantType) => {
      const newParams = new URLSearchParams(search);
      newParams.set('grantType', grantType);
      newParams.delete('currentPage');
      void navigate({ search: `${newParams.toString()}` }, { replace: true });
    },
    [search, navigate],
  );

  const createProjectMilestone = useCreateProjectMilestone(projectId);
  const { setFormType } = useManuscriptToast();

  const onSuccess = () => {
    setFormType({
      type: 'milestone-created',
      accent: 'successLarge',
    });
  };

  const onError = () => {
    setFormType({
      type: 'default-error',
      accent: 'error',
    });
  };

  // TODO: should be expanded to handle searching by project id as this will fail for user-based projects.
  const loadArticleOptions = useProjectArticlesSuggestions(teamId ?? projectId);

  return (
    <ProjectDetailMilestones
      hasSupplementGrant={hasSupplementGrant}
      seeAimsHref={seeAimsHref}
      selectedGrantType={selectedGrantType}
      isLead={isLead}
      onGrantTypeChange={handleGrantTypeChange}
      milestonesLastUpdated={milestonesLastUpdated}
      aims={aims}
      loadArticleOptions={loadArticleOptions}
      onCreateProjectMilestone={createProjectMilestone}
      onError={onError}
      onSuccess={onSuccess}
    >
      <SearchFrame title="Project Milestones">
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
