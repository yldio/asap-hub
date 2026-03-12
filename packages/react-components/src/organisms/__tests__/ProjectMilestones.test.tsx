import { render, screen } from '@testing-library/react';
import { Milestone } from '@asap-hub/model';
import ProjectMilestones from '../ProjectMilestones';

const mockMilestones: Milestone[] = [
  {
    id: '1',
    description: 'First milestone',
    status: 'Complete',
  },
  {
    id: '2',
    description: 'Second milestone',
    status: 'In Progress',
  },
  {
    id: '3',
    description: 'Third milestone',
    status: 'Pending',
  },
  {
    id: '4',
    description: 'Fourth milestone',
    status: 'Terminated',
  },
  {
    id: '5',
    description: 'Fifth milestone',
    status: 'Terminated',
  },
];

describe('ProjectMilestones', () => {
  it('renders table headers Aims, Milestone, Status', () => {
    render(<ProjectMilestones milestones={mockMilestones} />);
    expect(screen.getAllByText('Aims').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Milestone').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Status').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all milestones', () => {
    render(<ProjectMilestones milestones={mockMilestones} />);
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Second milestone')).toBeInTheDocument();
    expect(screen.getByText('Third milestone')).toBeInTheDocument();
    expect(screen.getByText('Fourth milestone')).toBeInTheDocument();
    expect(screen.getByText('Fifth milestone')).toBeInTheDocument();
  });

  it('renders nothing when milestones array is empty', () => {
    const { container } = render(<ProjectMilestones milestones={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
