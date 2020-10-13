import React, { useEffect } from 'react';
import { Paragraph, NetworkTeams } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';
import { join } from 'path';

import { useTeams } from '../api';
import { useLocation, useHistory } from 'react-router-dom';

interface NetworkTeamListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  // TODO extract all the new logic into a hook
  // TODO test
  const PAGE_SIZE = 10;
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const {
    loading,
    data: teamsData = { total: 0, items: [] },
    error,
  } = useTeams({
    searchQuery,
    filters: [...filters],
    currentPage,
    pageSize: PAGE_SIZE,
  });

  const { items, total: numberOfItems } = teamsData;

  const renderPageHref = (page: number) => {
    if (page === currentPage) return '';
    const pageSearchParams = new URLSearchParams(searchParams);
    if (page === 0) pageSearchParams.delete('currentPage');
    else pageSearchParams.set('currentPage', String(page));
    return `?${pageSearchParams.toString()}`;
  };
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / PAGE_SIZE) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;
  useEffect(() => {
    if (!loading && currentPage > lastAllowedPage)
      history.replace({ ...location, search: renderPageHref(lastAllowedPage) });
  });
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

  return (
    <>
      <NetworkTeams
        teams={teams}
        numberOfItems={numberOfItems}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
      />
      {loading && <Paragraph>Loading...</Paragraph>}
    </>
  );
};

export default NetworkTeamList;
