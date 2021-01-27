import React, { ComponentProps } from 'react';
import { NetworkGroups } from '@asap-hub/react-components';
import { join } from 'path';

import { useGroups } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { GROUPS_PATH } from './routes';
import { NETWORK_PATH } from '../routes';

interface NetworkGroupListProps {
  searchQuery?: string;
}

const NetworkGroupList: React.FC<NetworkGroupListProps> = ({ searchQuery }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useGroups({
    searchQuery,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total ?? 0,
    pageSize,
  );

  const groups: ComponentProps<
    typeof NetworkGroups
  >['groups'] = result.items.map((group) => ({
    ...group,
    numberOfTeams: group.teams.length,
    href: join(`${NETWORK_PATH}/${GROUPS_PATH}`, group.id),
  }));

  return (
    <NetworkGroups
      groups={groups}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkGroupList;
