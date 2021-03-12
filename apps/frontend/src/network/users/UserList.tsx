import React from 'react';

import { NetworkPeople } from '@asap-hub/react-components';

import { useUsers } from './state';
import { usePaginationParams, usePagination } from '../../hooks';

interface UserListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const UserList: React.FC<UserListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useUsers({
    searchQuery,
    filters: [...filters],
    currentPage,
    pageSize,
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
