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
    postedPriorToJournalSubmission: 12,
    postedPriorPercentage: 80, // 12/15 = 80%
  },
  {
    teamId: '2',
    teamName: 'Team Beta',
    isTeamInactive: false,
    numberOfPreprints: 8,
    postedPriorToJournalSubmission: 6,
    postedPriorPercentage: 75, // 6/8 = 75%
  },
  {
    teamId: '3',
    teamName: 'Team Gamma',
    isTeamInactive: true,
    numberOfPreprints: 22,
    postedPriorToJournalSubmission: 18,
    postedPriorPercentage: 82, // 18/22 = 82%
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
