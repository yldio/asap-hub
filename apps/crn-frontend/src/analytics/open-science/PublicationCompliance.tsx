import { FC /* useState */ } from 'react';
import { PublicationComplianceTable } from '@asap-hub/react-components';
import {
  PublicationComplianceDataObject,
  // SortPublicationCompliance,
  // PublicationComplianceSortingDirection,
} from '@asap-hub/model';
import { usePagination, usePaginationParams } from '../../hooks';

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationCompliance: FC<PublicationComplianceProps> = ({
  tags: _tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  // TODO: add these back post MVP
  // const [sort, setSort] = useState<SortPublicationCompliance>('team_asc');
  // const [sortingDirection, setSortingDirection] =
  //   useState<PublicationComplianceSortingDirection>('asc');

  // Mock data - replace with actual data fetching logic
  const mockData: PublicationComplianceDataObject[] = [
    {
      teamId: '1',
      teamName: 'Team Alpha',
      isTeamInactive: false,
      overallCompliance: 87,
      ranking: 'ADEQUATE',
      datasetsPercentage: 92,
      datasetsRanking: 'OUTSTANDING',
      protocolsPercentage: 78,
      protocolsRanking: 'NEEDS IMPROVEMENT',
      codePercentage: 88,
      codeRanking: 'ADEQUATE',
      labMaterialsPercentage: 95,
      labMaterialsRanking: 'OUTSTANDING',
      numberOfPublications: 15,
      numberOfOutputs: 293,
      numberOfDatasets: 123,
      numberOfProtocols: 131,
      numberOfCode: 15,
      numberOfLabMaterials: 24,
      timeRange: 'all',
    },
    {
      teamId: '2',
      teamName: 'Team Beta',
      isTeamInactive: false,
      overallCompliance: 55,
      ranking: 'NEEDS IMPROVEMENT',
      datasetsPercentage: 47,
      datasetsRanking: 'NEEDS IMPROVEMENT',
      protocolsPercentage: 64,
      protocolsRanking: 'NEEDS IMPROVEMENT',
      codePercentage: 38,
      codeRanking: 'NEEDS IMPROVEMENT',
      labMaterialsPercentage: 0,
      labMaterialsRanking: 'LIMITED DATA',
      numberOfPublications: 7,
      numberOfOutputs: 92,
      numberOfDatasets: 34,
      numberOfProtocols: 50,
      numberOfCode: 8,
      numberOfLabMaterials: 0,
      timeRange: 'all',
    },
    {
      teamId: '3',
      teamName: 'Team Gamma',
      isTeamInactive: true,
      overallCompliance: 91,
      ranking: 'OUTSTANDING',
      datasetsPercentage: 100,
      datasetsRanking: 'OUTSTANDING',
      protocolsPercentage: 77,
      protocolsRanking: 'NEEDS IMPROVEMENT',
      codePercentage: 100,
      codeRanking: 'OUTSTANDING',
      labMaterialsPercentage: 100,
      labMaterialsRanking: 'OUTSTANDING',
      numberOfPublications: 2,
      numberOfOutputs: 34,
      numberOfDatasets: 18,
      numberOfProtocols: 13,
      numberOfCode: 1,
      numberOfLabMaterials: 2,
      timeRange: 'all',
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
        // setSort={setSort}
        // setSortingDirection={setSortingDirection}
        // sort={sort}
        // sortingDirection={sortingDirection}
      />
    </div>
  );
};

export default PublicationCompliance;
