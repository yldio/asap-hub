import { SearchFrame } from '@asap-hub/frontend-utils';
import { Aim, GrantType, milestoneStatuses } from '@asap-hub/model';
import {
  LabeledMultiSelect,
  ProjectDetailMilestones,
  ProjectMilestonesTable,
  ResearchOutputOption,
  SearchAndFilter,
} from '@asap-hub/react-components';
import { ComponentProps, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useManuscriptToast } from '../network/teams/useManuscriptToast';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useFetchMilestoneArticles } from './articles-state';
import { useCreateProjectMilestone, useProjectMilestones } from './state';

const milestoneControlsStyles = {
  display: 'grid',
  rowGap: 32,
} as const;

const milestoneStatusFilterOptions = [
  { title: 'STATUS' },
  ...milestoneStatuses.map((status) => ({
    label: status,
    value: status,
  })),
];

type TableContentProps = {
  projectId: string;
  selectedGrantType: GrantType;
  isLead: boolean;
  searchQuery: string;
  filters: Set<string>;
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
  searchQuery,
  filters,
  loadArticleOptions,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items: milestones = [], total } = useProjectMilestones({
    projectId,
    grantType: selectedGrantType,
    searchQuery,
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
      total={total}
      hasAppliedSearch={searchQuery.trim().length > 0 || filters.size > 0}
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

  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  const selectedGrantType: GrantType =
    hasSupplementGrant &&
    new URLSearchParams(search).get('grantType') !== 'original'
      ? 'supplement'
      : 'original';

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
      <div style={milestoneControlsStyles}>
        <SearchAndFilter
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder="Enter milestone description"
          filters={filters}
          onChangeFilter={toggleFilter}
          filterOptions={milestoneStatusFilterOptions}
          filterButtonText="Filter"
        />
        <SearchFrame title="Project Milestones">
          <ProjectMilestonesTableContent
            projectId={projectId}
            selectedGrantType={selectedGrantType}
            isLead={isLead}
            searchQuery={debouncedSearchQuery}
            filters={filters}
            loadArticleOptions={loadArticleOptions}
          />
        </SearchFrame>
      </div>
    </ProjectDetailMilestones>
  );
};

export default ProjectMilestones;
