import { TeamProductivityTable } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsTeamProductivity } from './state';

const TeamProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items: data, total } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamProductivityTable
      data={data}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default TeamProductivity;
