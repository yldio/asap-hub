import { FetchUsersFilter } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
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

type FiltersType = ComponentProps<typeof FilterPills>['filters'];
type FilterType = keyof FiltersType;

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

  const onRemove = (id: string, filterType: FilterType) => {
    const updatedFilters = {
      ...filters,
      [filterType]: (filters[filterType] || []).filter(
        (filter) => filter !== id,
      ),
    };
    updateFilters(backHref, updatedFilters);
  };

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
        filters={filters}
        workingGroups={workingGroups}
        projects={projects}
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
