import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  Aim,
  GrantType,
  MilestoneSortOption,
  milestoneSortOptions,
  milestoneStatuses,
} from '@asap-hub/model';
import {
  ExportButton,
  LabeledMultiSelect,
  ProjectDetailMilestones,
  ProjectMilestonesTable,
  ResearchOutputOption,
  SearchAndFilter,
} from '@asap-hub/react-components';
import { ComponentProps, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useManuscriptToast } from '../network/teams/useManuscriptToast';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import {
  useFetchMilestoneArticles,
  useUpdateMilestone,
  useUpdateMilestoneArticles,
} from './articles-state';
import {
  useCreateProjectMilestone,
  useExportProjectMilestones,
  useProjectMilestones,
} from './state';
import { downloadProjectMilestonesXlsx } from './export';

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
  projectName: string;
  selectedGrantType: GrantType;
  isLead: boolean;
  searchQuery: string;
  filters: Set<string>;
  loadArticleOptions: NonNullable<
    ComponentProps<
      typeof LabeledMultiSelect<ResearchOutputOption>
    >['loadOptions']
  >;
  sort: MilestoneSortOption;
  onToggleSort: () => void;
};

const ProjectMilestonesTableContent: React.FC<TableContentProps> = ({
  projectId,
  projectName,
  selectedGrantType,
  isLead,
  searchQuery,
  filters,
  loadArticleOptions,
  sort,
  onToggleSort,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items: milestones = [], total } = useProjectMilestones({
    projectId,
    grantType: selectedGrantType,
    searchQuery,
    filters,
    currentPage,
    pageSize,
    sort,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  const fetchExport = useExportProjectMilestones(projectId);

  const exportTableData = useCallback(
    () =>
      downloadProjectMilestonesXlsx(projectName, fetchExport, {
        grantType: selectedGrantType,
        search: searchQuery,
        filter: Array.from(filters),
        sort,
      }),
    [fetchExport, filters, projectName, searchQuery, selectedGrantType, sort],
  );

  // "Full Dataset" intentionally omits grantType so the workbook contains
  // every aim and milestone for the project across both Original and
  // Supplement grants — that's the meaning the PO assigned to the name.
  const exportFullDataset = useCallback(
    () => downloadProjectMilestonesXlsx(projectName, fetchExport, {}),
    [fetchExport, projectName],
  );

  const downloadSection = (
    <ExportButton
      info="Data in Table downloads the milestones currently shown (with your filters, search and sort applied) along with their related aims. Full Dataset downloads every aim and milestone for this project."
      buttons={[
        {
          buttonText: 'Data in Table',
          errorMessage:
            'There was an issue exporting the table data. Please try again.',
          exportResults: exportTableData,
        },
        {
          buttonText: 'Full Dataset',
          errorMessage:
            'There was an issue exporting the full dataset. Please try again.',
          exportResults: exportFullDataset,
        },
      ]}
    />
  );

  const fetchArticles = useFetchMilestoneArticles();
  const onSaveArticles = useUpdateMilestoneArticles();
  const rawUpdateMilestone = useUpdateMilestone();
  const { setFormType } = useManuscriptToast();

  const onChangeStatus = useCallback(
    async (
      milestoneId: string,
      status: (typeof milestoneStatuses)[number],
      articles?: ReadonlyArray<{ id: string; title: string; href: string }>,
    ) => {
      try {
        await rawUpdateMilestone(milestoneId, {
          status,
          ...(articles !== undefined && { articles }),
        });
      } catch (e) {
        setFormType({ type: 'default-error', accent: 'error' });
        throw e;
      }
    },
    [rawUpdateMilestone, setFormType],
  );

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
      onSaveArticles={onSaveArticles}
      onChangeStatus={onChangeStatus}
      selectedGrantType={selectedGrantType}
      total={total}
      hasAppliedSearch={searchQuery.trim().length > 0 || filters.size > 0}
      sort={sort}
      onToggleSort={onToggleSort}
      downloadSection={downloadSection}
    />
  );
};

const ProjectMilestones: React.FC<{
  readonly projectId: string;
  readonly projectName: string;
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
  projectName,
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

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const searchRef = useRef(search);
  searchRef.current = search;

  const selectedGrantType: GrantType =
    hasSupplementGrant && params.get('grantType') !== 'original'
      ? 'supplement'
      : 'original';

  const sortParam = params.get('sort');
  const sort: MilestoneSortOption = milestoneSortOptions.includes(
    sortParam as MilestoneSortOption,
  )
    ? (sortParam as MilestoneSortOption)
    : 'aim_asc';

  const handleGrantTypeChange = useCallback(
    (grantType: GrantType) => {
      const newParams = new URLSearchParams(searchRef.current);
      newParams.set('grantType', grantType);
      newParams.delete('currentPage');
      void navigate({ search: newParams.toString() }, { replace: true });
    },
    [navigate],
  );

  const handleToggleSort = useCallback(() => {
    const newParams = new URLSearchParams(searchRef.current);
    const next = newParams.get('sort') === 'aim_desc' ? 'aim_asc' : 'aim_desc';
    newParams.set('sort', next);
    newParams.delete('currentPage');
    void navigate({ search: newParams.toString() }, { replace: true });
  }, [navigate]);

  const createProjectMilestone = useCreateProjectMilestone(projectId);
  const { setFormType } = useManuscriptToast();

  const onSuccess = useCallback(() => {
    setFormType({
      type: 'milestone-created',
      accent: 'successLarge',
    });
  }, [setFormType]);

  const onError = useCallback(() => {
    setFormType({
      type: 'default-error',
      accent: 'error',
    });
  }, [setFormType]);

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
            projectName={projectName}
            selectedGrantType={selectedGrantType}
            isLead={isLead}
            searchQuery={debouncedSearchQuery}
            filters={filters}
            loadArticleOptions={loadArticleOptions}
            sort={sort}
            onToggleSort={handleToggleSort}
          />
        </SearchFrame>
      </div>
    </ProjectDetailMilestones>
  );
};

export default ProjectMilestones;
