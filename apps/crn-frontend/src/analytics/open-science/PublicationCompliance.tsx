import { FC, useState } from 'react';
import {
  PublicationComplianceTable,
  SortPublicationCompliance,
  PublicationComplianceSortingDirection,
  PublicationComplianceResponse,
} from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationCompliance: FC<PublicationComplianceProps> = ({
  tags: _tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const [sort, setSort] = useState<SortPublicationCompliance>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<PublicationComplianceSortingDirection>('asc');

  // Mock data - replace with actual data fetching logic
  const mockData: PublicationComplianceResponse[] = [
    {
      teamId: '1',
      teamName: 'Team Alpha',
      isTeamInactive: false,
      publications: 85,
      datasets: 92,
      protocols: 78,
      code: 88,
      labMaterials: 95,
    },
    {
      teamId: '2',
      teamName: 'Team Beta',
      isTeamInactive: false,
      publications: 72,
      datasets: 68,
      protocols: 85,
      code: 90,
      labMaterials: 82,
    },
    {
      teamId: '3',
      teamName: 'Team Gamma',
      isTeamInactive: true,
      publications: 95,
      datasets: 88,
      protocols: 92,
      code: 75,
      labMaterials: 89,
    },
    {
      teamId: '4',
      teamName: 'Team Delta',
      isTeamInactive: false,
      publications: 68,
      datasets: 75,
      protocols: 82,
      code: 85,
      labMaterials: 78,
    },
    {
      teamId: '5',
      teamName: 'Team Epsilon',
      isTeamInactive: false,
      publications: 90,
      datasets: 95,
      protocols: 88,
      code: 92,
      labMaterials: 85,
    },
  ];

  const total = mockData.length;
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <div>
      <PublicationComplianceTable
        currentPageIndex={currentPage}
        data={mockData}
        numberOfPages={numberOfPages}
        renderPageHref={renderPageHref}
        setSort={setSort}
        setSortingDirection={setSortingDirection}
        sort={sort}
        sortingDirection={sortingDirection}
      />
    </div>
  );
};

export default PublicationCompliance;
