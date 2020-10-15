import React from 'react';
import { Paragraph, NetworkTeams } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';
import { join } from 'path';

import { useTeams } from '../api';
import { usePaginationParams, usePagination } from '../hooks';

interface NetworkTeamListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const {
    loading,
    data: teamsData = { total: 0, items: [] },
    error,
  } = useTeams({
    searchQuery,
    filters: [...filters],
    currentPage,
    pageSize,
  });
  const { items, total: numberOfItems } = teamsData;
  const { numberOfPages, renderPageHref } = usePagination(
    numberOfItems,
    pageSize,
  );
  const teams = items.map((team: TeamResponse) => ({
    ...team,
    href: join('/network/teams', team.id),
  }));

  if (error) {
    return (
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    );
  }
  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  return (
    <NetworkTeams
      teams={teams}
      numberOfItems={numberOfItems}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkTeamList;
