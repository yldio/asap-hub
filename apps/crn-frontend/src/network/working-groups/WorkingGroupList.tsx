import { NetworkWorkingGroups } from '@asap-hub/react-components';
import { useWorkingGroups } from './state';
import { usePagination, usePaginationParams } from '../../hooks';
import { usePrefetchTeams } from '../teams/state';
import { usePrefetchInterestGroups } from '../interest-groups/state';

interface NetworkWorkingGroupListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NetworkWorkingGroupList: React.FC<NetworkWorkingGroupListProps> = ({
  filters,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useWorkingGroups({
    searchQuery,
    currentPage,
    pageSize,
    filters,
  });

  usePrefetchTeams({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });

  usePrefetchInterestGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total ?? 0,
    pageSize,
  );

  return (
    <NetworkWorkingGroups
      workingGroups={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkWorkingGroupList;
