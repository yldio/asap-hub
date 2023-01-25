import { FetchUsersFilter, gp2 as gp2Model } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps, useCallback } from 'react';
import { usersHeaderImage } from '../images';
import { FiltersModal } from '../organisms';
import FilterPills from '../organisms/FilterPills';
import FilterSearchExport from '../organisms/FilterSearchExport';
import PageBanner from '../organisms/PageBanner';

const { rem } = pixels;
const bannerProps = {
  image: usersHeaderImage,
  position: 'top',
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

type UsersPageProps = ComponentProps<typeof FilterSearchExport> & {
  displayFilters?: boolean;
  changeLocation: (path: string) => void;
  updateFilters: (path: string, filter: FetchUsersFilter) => void;
} & Pick<
    ComponentProps<typeof FiltersModal>,
    'filters' | 'projects' | 'workingGroups'
  >;

type FilterPillValue = ComponentProps<typeof FilterPills>['pills'][number];
type FilterPillId = FilterPillValue['id'];
type FiltersType = FilterPillValue['typeOfFilter'];
type ProjectsType = Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];
type WorkingGroupsType = Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];
type LabelArrayType = ProjectsType | WorkingGroupsType;

const getPillValues = (
  projects: ProjectsType,
  workingGroups: WorkingGroupsType,
) => {
  const map: Record<FiltersType, LabelArrayType> = {
    projects,
    workingGroups,
    keywords: [],
    regions: [],
  };
  const getLabelBy = (type: FiltersType) => (id: string) => {
    const items = map[type].filter((value) => value.id === id);
    return items[0]?.title ?? id;
  };

  return (
    filters: Pick<
      gp2Model.FetchUsersFilter,
      'keywords' | 'regions' | 'workingGroups' | 'projects'
    >,
  ) =>
    Object.entries(filters)
      .map(([key, filterList]) => {
        const typeOfFilter = key as FiltersType;
        const getLabel = getLabelBy(typeOfFilter);
        return filterList.map((id) => ({
          id,
          typeOfFilter,
          label: getLabel(id),
        }));
      })
      .flat();
};
const containerStyles = css({
  marginTop: rem(48),
});

const UsersPage: React.FC<UsersPageProps> = ({
  children,
  searchQuery,
  onSearchQueryChange,
  onFiltersClick,
  onExportClick,
  isAdministrator,
  displayFilters = false,
  changeLocation,
  filters,
  updateFilters,
  projects,
  workingGroups,
}) => {
  const { users } = gp2;
  const backHref = users({}).$;
  const onBackClick = () => changeLocation(backHref);

  const onRemove = useCallback(
    (id: FilterPillId, typeOfFilter: FiltersType) => {
      const newFilter = (filters[typeOfFilter] || []).filter(
        (filter) => filter !== id,
      );
      const updatedFilters = {
        ...filters,
        [typeOfFilter]: newFilter,
      };
      updateFilters(backHref, updatedFilters);
    },
    [filters, backHref, updateFilters],
  );
  const pillsValues = getPillValues(projects, workingGroups);

  return (
    <article>
      <PageBanner {...bannerProps} />
      <div css={containerStyles}>
        <FilterSearchExport
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onFiltersClick={onFiltersClick}
          onExportClick={onExportClick}
          isAdministrator={isAdministrator}
        />
      </div>
      <FilterPills pills={pillsValues(filters)} onRemove={onRemove} />
      <main>{children}</main>
      {displayFilters && (
        <FiltersModal
          onBackClick={onBackClick}
          filters={filters}
          onApplyClick={(filter) => updateFilters(backHref, filter)}
          projects={projects}
          workingGroups={workingGroups}
        />
      )}
    </article>
  );
};

export default UsersPage;
