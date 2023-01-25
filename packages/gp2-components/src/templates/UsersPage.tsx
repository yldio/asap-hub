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

type FilterPillValueList = ComponentProps<typeof FilterPills>['values'];

type FilterPillValue = FilterPillValueList[number];

type FiltersType = FilterPillValue['typeOfFilter'];

type FilterMappingType = {
  [key: string]: (filter: string) => string;
};

type ProjectsType = Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];

type WorkingGroupsType = Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];

type LabelArrayType = ProjectsType | WorkingGroupsType;

function getLabelWithArray(array: LabelArrayType, filter: string) {
  const index = array.findIndex((value) => value.id === filter);
  return array[index].title;
}

const mapFilters = (
  filters: Pick<
    gp2Model.FetchUsersFilter,
    'keywords' | 'regions' | 'workingGroups' | 'projects'
  >,
  projects: ProjectsType,
  workingGroups: WorkingGroupsType,
) => {
  const getLabel: FilterMappingType = {
    keywords: (filter: string) => filter,
    regions: (filter: string) => filter,
    projects: (filter: string) => getLabelWithArray(projects, filter),
    workingGroups: (filter: string) => getLabelWithArray(workingGroups, filter),
  };

  return Object.entries(filters)
    .map<FilterPillValueList>(([typeOfFilter, filterList]) =>
      filterList.map((filterId) => ({
        id: filterId,
        typeOfFilter: typeOfFilter as FiltersType,
        label: getLabel[typeOfFilter](filterId),
      })),
    )
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
    (value: FilterPillValue) => {
      const { id, typeOfFilter } = value;
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
      <FilterPills
        values={mapFilters(filters, projects, workingGroups)}
        onRemove={onRemove}
      />
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
