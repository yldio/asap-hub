import { UsersPageBody, FiltersModal } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useUsersState } from './state';

const UserList: React.FC<Record<string, never>> = () => {
  const { users } = gp2;

  const { currentPage, pageSize } = usePaginationParams();
  const userList = useUsersState({
    currentPage,
    pageSize,
    searchQuery: '',
    filters: new Set(),
  });
  const { numberOfPages, renderPageHref } = usePagination(
    userList.total,
    pageSize,
  );
  const backHref = users({}).$;
  const filtersHref = users({}).filters({}).$;
  return (
    <>
      <UsersPageBody
        users={userList}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
        filtersHref={filtersHref}
      />
      <Route exact path={filtersHref}>
        <FiltersModal backHref={backHref} />
      </Route>
    </>
  );
};
export default UserList;
