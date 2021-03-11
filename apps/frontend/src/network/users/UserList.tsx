import React from 'react';

import { NetworkPeople } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { NETWORK_PATH } from '../../routes';
import { TEAMS_PATH } from '../routes';

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

  const users = result.items.map((user: UserResponse) => ({
    ...user,
    href: join(`${NETWORK_PATH}/users`, user.id),
    teams: user.teams.map((team) => ({
      ...team,
      href: `${NETWORK_PATH}/${TEAMS_PATH}/${team.id}`,
    })),
  }));
  return (
    <NetworkPeople
      people={users}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserList;
