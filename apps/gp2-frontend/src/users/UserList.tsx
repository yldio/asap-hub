import { FiltersModal, UsersPageBody } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useUsersState } from './state';

type UserListProps = {
  searchQuery: string;
} & Pick<ComponentProps<typeof FiltersModal>, 'filters'>;

const UserList: React.FC<UserListProps> = ({ searchQuery, filters }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const userList = useUsersState({
    skip: currentPage * pageSize,
    take: pageSize,
    search: searchQuery,
    filter: filters,
  });
  const { numberOfPages, renderPageHref } = usePagination(
    userList.total,
    pageSize,
  );
  return (
    <UsersPageBody
      users={userList}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};
export default UserList;
