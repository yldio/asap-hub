import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Milestone } from '@asap-hub/model';
import ProjectMilestones from '../ProjectMilestones';

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Milestone 1',
    description: 'First milestone',
    status: 'Complete',
  },
  {
    id: '2',
    title: 'Milestone 2',
    description: 'Second milestone',
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Milestone 3',
    description: 'Third milestone',
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Milestone 4',
    description: 'Fourth milestone',
    status: 'Not Started',
  },
  {
    id: '5',
    title: 'Milestone 5',
    description: 'Fifth milestone',
    status: 'Incomplete',
  },
];

describe('ProjectMilestones', () => {
  it('renders milestones title', () => {
    render(<ProjectMilestones milestones={mockMilestones} />);
    expect(screen.getByText('Milestones')).toBeInTheDocument();
  });

  it('renders milestone description text', () => {
    render(<ProjectMilestones milestones={mockMilestones} />);
    expect(
      screen.getByText('The milestones of this project are:'),
    ).toBeInTheDocument();
  });

  it('renders initial display count of milestones', () => {
    render(
      <ProjectMilestones milestones={mockMilestones} initialDisplayCount={3} />,
    );
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Second milestone')).toBeInTheDocument();
    expect(screen.getByText('Third milestone')).toBeInTheDocument();
    expect(screen.queryByText('Fourth milestone')).not.toBeInTheDocument();
  });

  it('shows View More link when there are more milestones', () => {
    render(
      <ProjectMilestones milestones={mockMilestones} initialDisplayCount={3} />,
    );
    expect(screen.getByText('Show More Milestones')).toBeInTheDocument();
  });

  it('does not show View More link when all milestones are displayed', () => {
    render(<ProjectMilestones milestones={mockMilestones.slice(0, 2)} />);
    expect(screen.queryByText('Show More Milestones')).not.toBeInTheDocument();
  });

  it('expands to show all milestones when View More is clicked', async () => {
    render(
      <ProjectMilestones milestones={mockMilestones} initialDisplayCount={2} />,
    );

    expect(screen.queryByText('Third milestone')).not.toBeInTheDocument();

    const viewMoreButton = screen.getByRole('button', {
      name: /Show More Milestones/i,
    });
    await userEvent.click(viewMoreButton);

    expect(screen.getByText('Third milestone')).toBeInTheDocument();
    expect(screen.getByText('Fourth milestone')).toBeInTheDocument();
    expect(screen.getByText('Fifth milestone')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Show Less Milestones/i }),
    ).toBeInTheDocument();
  });

  it('uses default initialDisplayCount of 4', () => {
    render(<ProjectMilestones milestones={mockMilestones} />);
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Fourth milestone')).toBeInTheDocument();
    expect(screen.queryByText('Fifth milestone')).not.toBeInTheDocument();
    expect(screen.getByText('Show More Milestones')).toBeInTheDocument();
  });

  it('renders nothing when milestones array is empty', () => {
    const { container } = render(<ProjectMilestones milestones={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
