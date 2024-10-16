import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { WorkingGroupCard } from '..';

describe('WorkingGroupCard', () => {
  const defaultProps = gp2Fixtures.createWorkingGroupResponse();
  it('renders the title', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 3, name: /Working Group Title/i }),
    ).toBeInTheDocument();
  });
  it('links to the detail page', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: /Working Group Title/i }),
    ).toBeInTheDocument();
  });
  it('renders a count of the members', () => {
    render(<WorkingGroupCard {...defaultProps} members={[]} />);
    expect(screen.getByText(/0 members/i)).toBeInTheDocument();
  });
  it('renders a single count of the members', () => {
    const props: gp2Model.WorkingGroupResponse = {
      ...defaultProps,
      members: [
        {
          userId: '11',
          role: 'Lead',
          firstName: 'Tony',
          lastName: 'Stark',
          displayName: 'Tony Stark',
        },
      ],
    };
    render(<WorkingGroupCard {...props} />);
    expect(screen.getByText(/1 member/i)).toBeInTheDocument();
  });
  it('renders the short description', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByText(/This is a short description/i),
    ).toBeInTheDocument();
  });
  it('renders the leading members', () => {
    render(<WorkingGroupCard {...defaultProps} />);
    expect(
      screen.getByText(/This is a list of leading members/i),
    ).toBeInTheDocument();
  });
  it('renders the tags', () => {
    render(
      <WorkingGroupCard
        {...defaultProps}
        tags={[{ id: '1', name: 'TestTag' }]}
      />,
    );
    expect(screen.getByText(/TestTag/i)).toBeInTheDocument();
  });
});
