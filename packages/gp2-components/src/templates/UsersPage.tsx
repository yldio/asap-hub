import { FetchUsersFilter } from '@asap-hub/model';
import { gp2 } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { usersHeaderImage } from '../images';
import { FiltersModal } from '../organisms';
import FilterSearchExport from '../organisms/FilterSearchExport';
import PageBanner from '../organisms/PageBanner';

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
  return (
    <article>
      <PageBanner {...bannerProps} />
      <FilterSearchExport
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onFiltersClick={onFiltersClick}
        onExportClick={onExportClick}
        isAdministrator={isAdministrator}
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
