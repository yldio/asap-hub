import { ComponentProps } from 'react';
import { NetworkInterestGroups } from '@asap-hub/react-components';

import { useInterestGroups } from './state';
import { usePaginationParams, usePagination } from '../../hooks';
import { usePrefetchTeams } from '../teams/state';
import { usePrefetchWorkingGroups } from '../working-groups/state';

interface NetworkGroupListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NetworkGroupList: React.FC<NetworkGroupListProps> = ({
  filters,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const result = useInterestGroups({
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

  usePrefetchWorkingGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total ?? 0,
    pageSize,
  );

  const interestGroups: ComponentProps<
    typeof NetworkInterestGroups
  >['interestGroups'] = result.items.map((interestGroup) => ({
    ...interestGroup,
    numberOfTeams: interestGroup.teams.filter(
      ({ inactiveSince }) => !inactiveSince,
    ).length,
    googleDrive: interestGroup.tools.googleDrive,
  }));

  return (
    <NetworkInterestGroups
      interestGroups={interestGroups}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkGroupList;
