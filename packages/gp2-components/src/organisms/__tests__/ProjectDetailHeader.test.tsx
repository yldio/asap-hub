import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ProjectDetailHeader from '../ProjectDetailHeader';

describe('ProjectDetailHeader', () => {
  const defaultProps: ComponentProps<typeof ProjectDetailHeader> = {
    id: '42',
    title: 'Main Project',
    status: 'Active' as const,
    members: [],
    startDate: '2022-09-22T00:00:00Z',
    endDate: '2022-09-30T00:00:00Z',
    projectProposalUrl: 'www.google.pt',
    isProjectMember: true,
    traineeProject: false,
    isAdministrator: false,
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };

  it('renders title, number of members and number of projects', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Main Project' })).toBeVisible();
    expect(screen.getByText('0 Members')).toBeVisible();
    expect(screen.getByText('View proposal')).toBeVisible();
  });

  it('renders opportunities available card when there a link', () => {
    render(<ProjectDetailHeader {...defaultProps} opportunitiesLink="link" />);
    expect(
      screen.getByRole('heading', { name: /opportunities available/i }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute(
      'href',
      'link',
    );
  });
  it('renders overview tab', () => {
    render(<ProjectDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
  it('renders resources tab if you are a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={true} />);
    expect(screen.getByRole('link', { name: 'Resources' })).toBeVisible();
  });
  it('does not render resources tab if you are not a member', () => {
    render(<ProjectDetailHeader {...defaultProps} isProjectMember={false} />);
    expect(
      screen.queryByRole('link', { name: 'Resources' }),
    ).not.toBeInTheDocument();
  });
  it('renders share output if you are an admin', () => {
    render(<ProjectDetailHeader {...defaultProps} isAdministrator={true} />);
    expect(
      screen.getByRole('button', { name: /share an output/i }),
    ).toBeVisible();
  });
  it('renders outputs tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} outputsTotal={42} />);
    expect(
      screen.getByRole('link', { name: /shared outputs \(42\)/i }),
    ).toBeVisible();
  });
  it('renders upcoming events tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} upcomingTotal={42} />);
    expect(
      screen.getByRole('link', { name: /upcoming events \(42\)/i }),
    ).toBeVisible();
  });
  it('renders past events tab with the count', () => {
    render(<ProjectDetailHeader {...defaultProps} pastTotal={42} />);
    expect(
      screen.getByRole('link', { name: /past events \(42\)/i }),
    ).toBeVisible();
  });
});
