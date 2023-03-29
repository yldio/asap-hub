import { createCsvFileStream, Frame } from '@asap-hub/frontend-utils';
import { UsersPageList } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { ComponentProps, FC } from 'react';
import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { useSearch } from '../hooks/search';
import { useProjectsState } from '../projects/state';
import { useWorkingGroupsState } from '../working-groups/state';
import { getUsers } from './api';
import {
  MAX_SQUIDEX_RESULTS,
  squidexUsersResponseToStream,
  userFields,
  userToCSV,
} from './export';
import UserList from './UserList';

type UserDirectoryProps = Pick<
  ComponentProps<typeof UsersPageList>,
  'displayFilters'
>;

const UserDirectory: FC<UserDirectoryProps> = ({ displayFilters = false }) => {
  const { users } = gp2;
  const {
    changeLocation,
    filters,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    updateFilters,
  } = useSearch();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const filtersHref = users({}).filters({}).$;
  const onFiltersClick = () => changeLocation(filtersHref);
  const autorization = useRecoilValue(authorizationState);
  const exportUsers = () =>
    squidexUsersResponseToStream(
      createCsvFileStream('user_export.csv', {
        columns: userFields,
        header: true,
      }),
      (paginationParams) =>
        getUsers(
          {
            ...paginationParams,
            filter: {
              ...filters,
              onlyOnboarded: false,
            },
            search: '',
          },
          autorization,
        ),
      userToCSV,
    );

  const { items: projects } = useProjectsState({
    pageSize: MAX_SQUIDEX_RESULTS,
    searchQuery: '',
    currentPage: 0,
    filters: new Set(),
  });
  const { items: workingGroups } = useWorkingGroupsState();
  return (
    <UsersPageList
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onFiltersClick={onFiltersClick}
      onExportClick={exportUsers}
      isAdministrator={isAdministrator}
      changeLocation={changeLocation}
      displayFilters={displayFilters}
      updateFilters={updateFilters}
      projects={projects}
      workingGroups={workingGroups}
      filters={filters}
    >
      <Frame title="User List">
        <UserList searchQuery={debouncedSearchQuery} filters={filters} />
      </Frame>
    </UsersPageList>
  );
};

export default UserDirectory;
