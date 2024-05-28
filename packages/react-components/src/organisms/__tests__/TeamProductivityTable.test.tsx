import { teamProductivityPerformance } from '@asap-hub/fixtures';
import { TeamProductivityResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import TeamProductivityTable from '../TeamProductivityTable';

describe('TeamProductivityTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const defaultProps: ComponentProps<typeof TeamProductivityTable> = {
    ...pageControlsProps,
    performance: teamProductivityPerformance,
    data: [],
  };

  const teamProductivity: TeamProductivityResponse = {
    id: '1',
    name: 'Test Team',
    isInactive: false,
    Article: 9,
    Bioinformatics: 7,
    Dataset: 5,
    'Lab Resource': 1,
    Protocol: 3,
  };

  it('renders data', () => {
    const data = [teamProductivity];
    const { getByText } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('displays the caption and icon in row values', () => {
    const data = [teamProductivity];
    const { getByText, getAllByTitle } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('Article:')).toBeVisible();
    expect(getByText('Bioinformatics:')).toBeVisible();
    expect(getByText('Datasets:')).toBeVisible();
    expect(getByText('Lab Resources:')).toBeVisible();
    expect(getByText('Protocols:')).toBeVisible();
    expect(getAllByTitle('Below Average').length).toEqual(6);
    expect(getAllByTitle('Average').length).toEqual(8);
    expect(getAllByTitle('Above Average').length).toEqual(6);
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...teamProductivity,
        isInactive: true,
      },
    ];
    const { getByTitle } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });
});
