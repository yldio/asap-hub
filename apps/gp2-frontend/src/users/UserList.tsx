import { UsersPageBody } from '@asap-hub/gp2-components';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useUsersState } from './state';

const UserList: React.FC<Record<string, never>> = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const users = useUsersState({
    currentPage,
    pageSize,
    searchQuery: '',
    filters: new Set(),
  });
  const { numberOfPages, renderPageHref } = usePagination(
    users.total,
    pageSize,
  );
  return (
    <UsersPageBody
      users={users}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};
export default UserList;
