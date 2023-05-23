import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import WorkingGroupDetailHeader from '../WorkingGroupDetailHeader';

describe('WorkingGroupDetailHeader', () => {
  const defaultProps: ComponentProps<typeof WorkingGroupDetailHeader> = {
    title: 'Underrepresented Populations',
    members: [],
    projects: [],
    id: '1',
    isWorkingGroupMember: true,
    isAdministrator: false,
    outputsTotal: 0,
    upcomingTotal: 0,
    pastTotal: 0,
  };

  it('renders title, number of members and number of projects', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Underrepresented Populations' }),
    ).toBeVisible();
    expect(screen.getByText('0 members')).toBeVisible();
    expect(screen.getByText('0 projects')).toBeVisible();
  });

  it('renders overview tab', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
  it('renders Workspace tab if you are a member', () => {
    render(
      <WorkingGroupDetailHeader
        {...defaultProps}
        isWorkingGroupMember={true}
      />,
    );
    expect(screen.getByRole('link', { name: 'Workspace' })).toBeVisible();
  });
  it('does not render Workspace tab if you are not a member', () => {
    render(
      <WorkingGroupDetailHeader
        {...defaultProps}
        isWorkingGroupMember={false}
      />,
    );
    expect(
      screen.queryByRole('link', { name: 'Workspace' }),
    ).not.toBeInTheDocument();
  });
  it('renders share output if you are an admin', () => {
    render(
      <WorkingGroupDetailHeader {...defaultProps} isAdministrator={true} />,
    );
    expect(
      screen.getByRole('button', { name: /share an output/i }),
    ).toBeVisible();
  });
  it('renders outputs tab with the count', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} outputsTotal={42} />);
    expect(
      screen.getByRole('link', { name: /shared outputs \(42\)/i }),
    ).toBeVisible();
  });
  it('renders upcoming events tab with the count', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} upcomingTotal={42} />);
    expect(
      screen.getByRole('link', { name: /upcoming events \(42\)/i }),
    ).toBeVisible();
  });
  it('renders past events tab with the count', () => {
    render(<WorkingGroupDetailHeader {...defaultProps} pastTotal={42} />);
    expect(
      screen.getByRole('link', { name: /past events \(42\)/i }),
    ).toBeVisible();
  });
});
