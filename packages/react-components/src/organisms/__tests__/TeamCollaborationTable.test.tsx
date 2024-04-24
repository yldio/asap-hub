import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import TeamCollaborationTable, {
  CollaborationType,
  TeamCollaborationMetric,
} from '../TeamCollaborationTable';

describe('TeamCollaborationTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const teamCollaboration: TeamCollaborationMetric = {
    id: '1',
    name: 'Test Team',
    isInactive: false,
    Article: 1,
    Bioinformatics: 2,
    Dataset: 3,
    'Lab Resource': 4,
    Protocol: 5,
    'Collaboration Details': [
      {
        id: '2',
        name: 'Other Team',
        isInactive: false,
        Article: 1,
        Bioinformatics: 2,
        Dataset: 3,
        'Lab Resource': 4,
        Protocol: 5,
      },
    ],
    type: 'across-teams',
  };

  it('renders data', () => {
    const data = [
      { ...teamCollaboration, type: 'within-team' as CollaborationType },
    ];
    const { getByText } = render(
      <TeamCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...teamCollaboration,
        isInactive: true,
      },
    ];
    const { getByTitle } = render(
      <TeamCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('allows collapsing and expanding rows', () => {
    const data = [
      {
        ...teamCollaboration,
      },
    ];
    const { getByRole, getByText, queryByText } = render(
      <TeamCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(queryByText('Other Team')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(getByText('Other Team')).toBeVisible();
  });
});
