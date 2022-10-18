import { ComponentProps } from 'react';
import { NetworkGroups } from '@asap-hub/react-components';

import { useGroups } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchTeams } from '../teams/state';

interface NetworkGroupListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NetworkGroupList: React.FC<NetworkGroupListProps> = ({
  filters,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useGroups({
    searchQuery,
    currentPage,
    pageSize,
    filters,
  });

  usePrefetchTeams({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total ?? 0,
    pageSize,
  );

  const groups: ComponentProps<typeof NetworkGroups>['groups'] =
    result.items.map((group) => ({
      ...group,
      numberOfTeams: group.teams.filter(({ inactiveSince }) => !inactiveSince)
        .length,
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
