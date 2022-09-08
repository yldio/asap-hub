import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  const defaultProps = {
    id: '42',
    title: 'A Project',
    startDate: '2020-07-06',
    endDate: '2021-12-28',
    status: 'Completed' as const,
    projectProposalUrl: 'http://a-proposal',
    members: [],
  };
  it('renders the status', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText('Completed')).toBeVisible();
  });
  it('render a externalLink', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(
      (
        screen.getByRole('link', {
          name: 'External Link View proposal',
        }) as HTMLAnchorElement
      ).href,
    ).toMatchInlineSnapshot(`"http://a-proposal/"`);
  });
  it('renders title', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 3, name: /A Project/i }),
    ).toBeVisible();
  });
  it('renders a count of the members', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText(/0 members/i)).toBeVisible();
  });
  it('renders the start date', () => {
    render(<ProjectCard {...defaultProps} endDate={undefined} />);
    expect(screen.getByText('Jul 2020')).toBeVisible();
  });
  it('renders the month duration if it has an end date', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText('Jul 2020 - Dec 2021 ·')).toBeVisible();
    expect(screen.getByText('(18 months)')).toBeVisible();
  });
});
