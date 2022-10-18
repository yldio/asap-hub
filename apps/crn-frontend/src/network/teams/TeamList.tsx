import { NetworkTeams } from '@asap-hub/react-components';

import { useTeams } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchGroups } from '../groups/state';

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
  usePrefetchGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters,
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
