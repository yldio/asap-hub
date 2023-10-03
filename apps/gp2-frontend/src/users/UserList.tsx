import { FiltersModal, UsersPageBody } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useUsers } from './state';

type UserListProps = {
  searchQuery: string;
} & Pick<ComponentProps<typeof FiltersModal>, 'filters'>;

const UserList: React.FC<UserListProps> = ({ searchQuery, filters }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const userList = useUsers({
    currentPage,
    pageSize,
    searchQuery,
    filters: new Set(),
    keywords: filters.keywords,
    regions: filters.regions,
    projects: filters.projects,
    workingGroups: filters.workingGroups,
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
