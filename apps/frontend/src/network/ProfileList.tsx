import React from 'react';

import { Paragraph, NetworkPeople } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from '../api';
import { usePaginationParams, usePagination } from '../hooks';

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
    return <Paragraph>Loading...</Paragraph>;
  }

  const users = result.data.items.map((user: UserResponse) => ({
    ...user,
    href: join('/network/users', user.id),
    teams: user.teams.map((team) => ({
      ...team,
      href: `/network/teams/${team.id}`,
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
