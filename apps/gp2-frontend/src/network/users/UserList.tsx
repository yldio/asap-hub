import { NetworkPeople } from '@asap-hub/react-components';

import { useUsers } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchTeams } from '../teams/state';
import { usePrefetchGroups } from '../groups/state';

interface UserListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const UserList: React.FC<UserListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useUsers({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  usePrefetchTeams({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });
  usePrefetchGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <NetworkPeople
      people={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserList;
