import { TeamProductivityTable } from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamProductivity,
  useTeamProductivityPerformance,
} from './state';

const TeamProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const { items: data, total } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    timeRange,
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
