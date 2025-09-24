import { FC /* useState */ } from 'react';
import { PreprintComplianceTable } from '@asap-hub/react-components';
import {
  PreprintComplianceResponse,
  // PreprintComplianceSortingDirection,
  // SortPreprintCompliance
} from '@asap-hub/model';
import { usePagination, usePaginationParams } from '../../hooks';

const mockData: PreprintComplianceResponse[] = [
  {
    teamId: '1',
    teamName: 'Team Alpha',
    isTeamInactive: false,
    numberOfPreprints: 15,
    numberOfPublications: 12,
    ranking: 'ADEQUATE',
    timeRange: 'all',
    postedPriorPercentage: 80,
  },
  {
    teamId: '2',
    teamName: 'Team Beta',
    isTeamInactive: false,
    numberOfPreprints: 8,
    numberOfPublications: 6,
    ranking: 'NEEDS IMPROVEMENT',
    timeRange: 'all',
    postedPriorPercentage: 75,
  },
  {
    teamId: '3',
    teamName: 'Team Gamma',
    isTeamInactive: true,
    numberOfPreprints: 22,
    numberOfPublications: 18,
    ranking: 'ADEQUATE',
    timeRange: 'all',
    postedPriorPercentage: 82,
  },
];

interface PreprintComplianceProps {
  tags: string[];
}

const PreprintCompliance: FC<PreprintComplianceProps> = ({ tags: _tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  // TODO: add these back post MVP
  // const [sort, setSort] = useState<SortPreprintCompliance>('team_asc');
  // const [sortingDirection, setSortingDirection] =
  //   useState<PreprintComplianceSortingDirection>('asc');

  const total = mockData.length;
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <div>
      <PreprintComplianceTable
        currentPageIndex={currentPage}
        data={mockData}
        numberOfPages={numberOfPages}
        renderPageHref={renderPageHref}
        // setSort={setSort}
        // setSortingDirection={setSortingDirection}
        // sort={sort}
        // sortingDirection={sortingDirection}
      />
    </div>
  );
};

export default PreprintCompliance;
