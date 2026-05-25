import { ComponentProps } from 'react';
import { NetworkInterestGroups } from '@asap-hub/react-components';

import { useInterestGroups } from './state';
import { usePaginationParams, usePagination } from '../../hooks';

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
