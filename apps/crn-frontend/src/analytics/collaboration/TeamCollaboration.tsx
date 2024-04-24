import { TeamCollaborationResponse } from '@asap-hub/model';
import {
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { CollaborationProps } from './UserCollaboration';

const getDataForType = (
  data: TeamCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): TeamCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isInactive: row.isInactive,
      ...row.OutputsCoProducedWithin,
      'Collaboration Details': [],
      type: 'within-team',
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isInactive: row.isInactive,
    ...row.OutputsCoProducedAcross,
    type: 'across-teams',
  }));
};

const TeamCollaboration: React.FC<CollaborationProps> = ({ type }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const teamItems: TeamCollaborationResponse[] = [
    {
      id: '1',
      name: 'Team A',
      isInactive: true,
      OutputsCoProducedWithin: {
        Article: 1,
        Bioinformatics: 1,
        Dataset: 0,
        'Lab Resource': 1,
        Protocol: 0,
      },
      OutputsCoProducedAcross: {
        Article: 1,
        Bioinformatics: 2,
        Dataset: 1,
        'Lab Resource': 0,
        Protocol: 2,
        'Collaboration Details': [
          {
            id: '2',
            name: 'Team B',
            isInactive: false,
            Article: 1,
            Bioinformatics: 2,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 2,
          },
        ],
      },
    },
    {
      id: '2',
      name: 'Team B',
      isInactive: false,
      OutputsCoProducedWithin: {
        Article: 1,
        Bioinformatics: 2,
        Dataset: 3,
        'Lab Resource': 4,
        Protocol: 5,
      },
      OutputsCoProducedAcross: {
        Article: 1,
        Bioinformatics: 2,
        Dataset: 2,
        'Lab Resource': 1,
        Protocol: 2,
        'Collaboration Details': [
          {
            id: '1',
            name: 'Team A',
            isInactive: true,
            Article: 1,
            Bioinformatics: 2,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 2,
          },
          {
            id: '5',
            name: 'Team E',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 1,
            Protocol: 0,
          },
          {
            id: '6',
            name: 'Team F',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 0,
          },
        ],
      },
    },
    {
      id: '3',
      name: 'Team C',
      isInactive: false,
      OutputsCoProducedWithin: {
        Article: 1,
        Bioinformatics: 0,
        Dataset: 3,
        'Lab Resource': 0,
        Protocol: 0,
      },
      OutputsCoProducedAcross: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
        'Collaboration Details': [],
      },
    },
    {
      id: '4',
      name: 'Team D',
      isInactive: false,
      OutputsCoProducedWithin: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      OutputsCoProducedAcross: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
        'Collaboration Details': [],
      },
    },
    {
      id: '5',
      name: 'Team E',
      isInactive: false,
      OutputsCoProducedWithin: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      OutputsCoProducedAcross: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 1,
        'Lab Resource': 1,
        Protocol: 0,
        'Collaboration Details': [
          {
            id: '2',
            name: 'Team B',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 1,
            Protocol: 0,
          },
          {
            id: '6',
            name: 'Team F',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 0,
          },
        ],
      },
    },
    {
      id: '6',
      name: 'Team F',
      isInactive: false,
      OutputsCoProducedWithin: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      OutputsCoProducedAcross: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 1,
        'Lab Resource': 0,
        Protocol: 0,
        'Collaboration Details': [
          {
            id: '2',
            name: 'Team B',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 0,
          },
          {
            id: '5',
            name: 'Team E',
            isInactive: false,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 1,
            'Lab Resource': 0,
            Protocol: 0,
          },
        ],
      },
    },
  ];

  const { items: data, total } = {
    total: 6,
    items: teamItems,
  };

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamCollaborationTable
      data={getDataForType(data, type)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default TeamCollaboration;
