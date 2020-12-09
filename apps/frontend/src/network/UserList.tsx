import React from 'react';

import { NetworkPeople, Loading } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from '../api';
import { usePaginationParams, usePagination } from '../hooks';
import { NETWORK_PATH } from '../routes';
import { TEAMS_PATH } from './routes';

interface ProfileListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const ProfileList: React.FC<ProfileListProps> = ({
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
    result.data?.total ?? 0,
    pageSize,
  );

  if (result.loading) {
    return <Loading />;
  }

  const users = result.data.items.map((user: UserResponse) => ({
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
      numberOfItems={result.data.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default ProfileList;
