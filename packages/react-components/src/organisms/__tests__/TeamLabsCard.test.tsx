import { render, screen, fireEvent } from '@testing-library/react';
import { LabDataObject } from '@asap-hub/model';
import TeamLabsCard from '../TeamLabsCard';

const createLabs = (length: number): LabDataObject[] =>
  Array.from({ length }, (_, i) => ({
    id: `lab-${i}`,
    name: `Lab ${i + 1}`,
  }));

describe('TeamLabsCard', () => {
  it('renders the headline and description', () => {
    render(<TeamLabsCard labs={createLabs(1)} />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Labs' }),
    ).toBeVisible();
    expect(
      screen.getByText('View the labs that were part of this team.'),
    ).toBeVisible();
  });

  it('renders the correct description when the team is active', () => {
    render(<TeamLabsCard labs={createLabs(1)} isTeamActive={true} />);
    expect(
      screen.getByText(
        'View the labs within this team and connect directly with their principal investigators.',
      ),
    ).toBeVisible();
  });

  it('renders a list of labs with links when pointOfContactId is provided', () => {
    const labs = createLabs(3);
    render(<TeamLabsCard labs={labs} pointOfContactId="poc-123" />);
    labs.forEach((lab) => {
      expect(screen.getByText(lab.name).closest('a')).toHaveAttribute(
        'href',
        '/network/users/poc-123',
      );
    });
  });

  it('renders a list of labs without links when pointOfContactId is not provided', () => {
    const labs = createLabs(3);
    render(<TeamLabsCard labs={labs} />);
    labs.forEach((lab) => {
      expect(screen.getByText(lab.name).closest('a')).not.toBeInTheDocument();
    });
  });

  it('renders a maximum of 8 labs initially', () => {
    const labs = createLabs(10);
    render(<TeamLabsCard labs={labs} />);

    // First 8 should be visible
    expect(screen.getByText('Lab 1')).toBeVisible();
    expect(screen.getByText('Lab 8')).toBeVisible();

    // 9th lab should not be visible (slice(0,8))
    expect(screen.queryByText('Lab 9')).not.toBeInTheDocument();
  });

  it('shows the "View More Labs" button if there are more than 8 labs', () => {
    render(<TeamLabsCard labs={createLabs(9)} />);
    expect(
      screen.getByRole('button', { name: /view more labs/i }),
    ).toBeVisible();
  });

  it('does not show the "View More Labs" button if there are 8 or fewer labs', () => {
    render(<TeamLabsCard labs={createLabs(8)} />);
    expect(
      screen.queryByRole('button', { name: /view more labs/i }),
    ).not.toBeInTheDocument();
  });

  it('expands the list when "View More Labs" is clicked', () => {
    render(<TeamLabsCard labs={createLabs(10)} />);

    const button = screen.getByRole('button', { name: /view more labs/i });
    fireEvent.click(button);

    // List should expand
    expect(screen.getByText('Lab 9')).toBeVisible();
    expect(screen.getByText('Lab 10')).toBeVisible();

    // Button should be gone
    expect(
      screen.queryByRole('button', { name: /view more labs/i }),
    ).not.toBeInTheDocument();
  });
});
