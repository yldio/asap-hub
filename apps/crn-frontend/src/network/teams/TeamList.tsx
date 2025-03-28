import { NetworkTeams } from '@asap-hub/react-components';

import { useTeams } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchInterestGroups } from '../interest-groups/state';
import { usePrefetchWorkingGroups } from '../working-groups/state';

interface NetworkTeamListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  filters,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useTeams({
    searchQuery,
    currentPage,
    pageSize,
    filters,
  });
  usePrefetchInterestGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters,
  });
  usePrefetchWorkingGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
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
