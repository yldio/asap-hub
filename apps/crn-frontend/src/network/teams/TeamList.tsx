import { network } from '@asap-hub/routing';
import { useRouteMatch } from 'react-router-dom';
import { TeamDataObject } from '@asap-hub/model';
import {
  NetworkTeams,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  colors,
} from '@asap-hub/react-components';
import { ReactElement } from 'react';

import { usePrefetchTeams, useTeams } from './state';
import {
  usePaginationParams,
  usePagination,
  CARD_VIEW_PAGE_SIZE,
} from '../../hooks';
import { usePrefetchInterestGroups } from '../interest-groups/state';
import { usePrefetchWorkingGroups } from '../working-groups/state';

interface NetworkTeamListProps {
  filters: Set<string>;
  searchQuery?: string;
}

const NoResultsIcon: Record<TeamDataObject['teamType'], ReactElement> = {
  'Discovery Team': <DiscoveryTeamIcon color={colors.charcoal.rgb} />,
  'Resource Team': <ResourceTeamIcon color={colors.charcoal.rgb} />,
};

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  filters,
  searchQuery = '',
}) => {
  const { path } = useRouteMatch();

  const teamType: TeamDataObject['teamType'] | null =
    path === network({}).discoveryTeams({}).$
      ? 'Discovery Team'
      : path === network({}).resourceTeams({}).$
        ? 'Resource Team'
        : null;

  const { currentPage, pageSize } = usePaginationParams();

  if (!teamType) {
    throw new Error(`Invalid route`);
  }

  const result = useTeams({
    searchQuery,
    currentPage,
    pageSize,
    filters,
    teamType,
  });
  usePrefetchTeams({
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
    teamType: teamType === 'Resource Team' ? 'Discovery Team' : 'Resource Team',
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
      icon={NoResultsIcon[teamType]}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default NetworkTeamList;
