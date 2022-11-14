import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { UsersPageBody, FiltersModal } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useSearch } from '../hooks/search';
import { getUsers } from './api';
import { squidexResultsToStream, userToCSV } from './export';
import { useUsersState } from './state';

type UserListProps = {
  displayFilters?: boolean;
};

const UserList: React.FC<UserListProps> = ({ displayFilters = false }) => {
  const { users } = gp2;
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';
  const { currentPage, pageSize } = usePaginationParams();
  const { filters, updateFilters, changeLocation } = useSearch();
  const userList = useUsersState({
    skip: currentPage * pageSize,
    take: pageSize,
    search: '',
    filter: filters,
  });
  const { numberOfPages, renderPageHref } = usePagination(
    userList.total,
    pageSize,
  );
  const backHref = users({}).$;
  const filtersHref = users({}).filters({}).$;
  const onBackClick = () => changeLocation(backHref);
  const onFiltersClick = () => changeLocation(filtersHref);
  const autorization = useRecoilValue(authorizationState);
  const exportUsers = () =>
    squidexResultsToStream(
      createCsvFileStream('user_export.csv'),
      (paginationParams) =>
        getUsers(
          {
            ...paginationParams,
          },
          autorization,
        ),
      userToCSV,
    );
  return (
    <>
      <UsersPageBody
        users={userList}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
        onFiltersClick={onFiltersClick}
        onExportClick={exportUsers}
        isAdministrator={isAdministrator}
      />
      {displayFilters && (
        <FiltersModal
          onBackClick={onBackClick}
          filters={filters}
          onApplyClick={(f) => updateFilters(backHref, f)}
        />
      )}
    </>
  );
};
export default UserList;
