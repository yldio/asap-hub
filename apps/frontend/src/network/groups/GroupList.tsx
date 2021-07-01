import { ComponentProps } from 'react';
import { NetworkGroups } from '@asap-hub/react-components';

import { useGroups } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchTeams } from '../teams/state';
import { usePrefetchUsers } from '../users/state';

interface NetworkGroupListProps {
  searchQuery?: string;
}

const NetworkGroupList: React.FC<NetworkGroupListProps> = ({
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useGroups({
    searchQuery,
    currentPage,
    pageSize,
    filters: new Set(),
  });
  usePrefetchUsers({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });
  usePrefetchTeams({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total ?? 0,
    pageSize,
  );

  const groups: ComponentProps<typeof NetworkGroups>['groups'] =
    result.items.map((group) => ({
      ...group,
      numberOfTeams: group.teams.length,
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
