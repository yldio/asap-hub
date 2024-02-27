import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ProjectSummaryFooter from '../ProjectSummaryFooter';

describe('ProjectSummaryFooter', () => {
  const defaultProps: ComponentProps<typeof ProjectSummaryFooter> = {
    members: [],
    startDate: '2020-07-06',
  };
  it('renders 0 members of the project', () => {
    render(<ProjectSummaryFooter {...defaultProps} />);
    expect(screen.getByText(/0 members/i)).toBeVisible();
  });

  it('renders 1 member of the project', () => {
    const props: ComponentProps<typeof ProjectSummaryFooter> = {
      ...defaultProps,
      members: [
        {
          userId: '7',
          firstName: 'Tony',
          lastName: 'Stark',
          displayName: 'Tony Stark',
          role: 'Project manager',
        },
      ],
    };
    render(<ProjectSummaryFooter {...props} />);
    expect(screen.getByText('1 Member')).toBeVisible();
  });

  it('renders 2 members of the project', () => {
    const props: ComponentProps<typeof ProjectSummaryFooter> = {
      ...defaultProps,
      members: [
        {
          userId: '7',
          firstName: 'Tony',
          lastName: 'Stark',
          displayName: 'Tony Stark',
          role: 'Project manager',
        },
        {
          userId: '11',
          firstName: 'Peter',
          lastName: 'Parker',
          displayName: 'Peter Parker',
          role: 'Investigator',
        },
      ],
    };
    render(<ProjectSummaryFooter {...props} />);
    expect(screen.getByText(/2 members/i)).toBeVisible();
  });

  it('renders the start date', () => {
    render(<ProjectSummaryFooter {...defaultProps} endDate={undefined} />);
    expect(screen.getByText('Jul 2020')).toBeVisible();
  });

  it('renders TBD when no start date', () => {
    render(<ProjectSummaryFooter {...defaultProps} startDate={undefined} />);
    expect(screen.getByText('TBD')).toBeVisible();
  });

  it('renders the month duration if it has a start date and an end date', () => {
    render(<ProjectSummaryFooter {...defaultProps} endDate={'2021-12-28'} />);
    expect(screen.getByText('Jul 2020 - Dec 2021 ·')).toBeVisible();
    expect(screen.getByText('(18 months)')).toBeVisible();
  });
});
