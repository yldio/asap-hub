import React from 'react';
import { NetworkTeams } from '@asap-hub/react-components';

import { useTeams } from './state';
import { usePaginationParams, usePagination } from '../../hooks';

interface NetworkTeamListProps {
  searchQuery?: string;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({ searchQuery }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useTeams({
    searchQuery,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <NetworkTeams
      teams={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkTeamList;
