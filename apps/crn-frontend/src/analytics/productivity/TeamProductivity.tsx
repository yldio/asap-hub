import { TeamProductivityTable } from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamProductivity,
  useTeamProductivityPerformance,
} from './state';

const TeamProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, type } = useAnalytics();

  const { items: data, total } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    timeRange,
    type
  });

  const performance = useTeamProductivityPerformance(timeRange);

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamProductivityTable
      data={data}
      performance={performance}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default TeamProductivity;
