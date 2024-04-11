import { TeamProductivityResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import TeamProductivityTable from '../TeamProductivityTable';

describe('TeamProductivityTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const teamProductivity: TeamProductivityResponse = {
    id: '1',
    name: 'Test Team',
    isInactive: false,
    Article: 1,
    Bioinformatics: 2,
    Dataset: 3,
    'Lab Resource': 4,
    Protocol: 5,
  };

  it('renders data', () => {
    const data = [teamProductivity];
    const { getByText } = render(
      <TeamProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...teamProductivity,
        isInactive: true,
      },
    ];
    const { getByTitle } = render(
      <TeamProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });
});
