import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectMilestones from '../ProjectMilestones';

describe('ProjectMilestones', () => {
  type Milestone = gp2.ProjectResponse['milestones'][0];
  const getMilestones = (length = 1): Milestone[] =>
    Array.from({ length }, (_, itemIndex) => ({
      id: `itemIndex`,
      title: `a title ${itemIndex}`,
      status: 'Active',
    }));
  it('renders the title when there are no milestons', () => {
    render(<ProjectMilestones milestones={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (0)' }),
    ).toBeInTheDocument();
  });
  it('renders the title with the correct count', () => {
    render(<ProjectMilestones milestones={getMilestones(11)} />);
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (11)' }),
    ).toBeInTheDocument();
  });

  it('renders a milestones', () => {
    render(<ProjectMilestones milestones={getMilestones(2)} />);
    expect(
      screen.getByRole('heading', { name: 'a title 0' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'a title 1' }),
    ).toBeInTheDocument();
  });

  it('Renders show more button for more than 3 milestones', async () => {
    const milestones = getMilestones(4);

    render(<ProjectMilestones milestones={milestones} />);

    expect(screen.getByRole('button', { name: /Show more/i })).toBeVisible();
  });
  it('Renders show less button when the show more button is clicked', async () => {
    const milestones = getMilestones(4);

    render(<ProjectMilestones milestones={milestones} />);

    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByRole('button', { name: /Show less/i })).toBeVisible();
  });
  it('does not show a more button for less than 3 milestones', async () => {
    const milestones = getMilestones(3);

    render(<ProjectMilestones milestones={milestones} />);

    expect(
      screen.queryByRole('button', { name: /Show more/i }),
    ).not.toBeInTheDocument();
  });
  it('displays the hidden milestones if the button is clicked', () => {
    const milestones = getMilestones(4);

    render(<ProjectMilestones milestones={milestones} />);
    expect(
      screen.getByRole('heading', { name: 'a title 2' }),
    ).toBeInTheDocument();
    expect(screen.getByText('a title 3')).not.toBeVisible();
    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByText('a title 3')).toBeVisible();
  });
});
