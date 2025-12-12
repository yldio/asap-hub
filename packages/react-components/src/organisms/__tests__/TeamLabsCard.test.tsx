import { render, screen, fireEvent } from '@testing-library/react';
import { LabDataObject } from '@asap-hub/model';
import TeamLabsCard from '../TeamLabsCard';

const createLabs = (length = 1, piId?: string): LabDataObject[] =>
  Array.from({ length }, (_, i) => ({
    id: `l${i}`,
    name: `Lab ${i}`,
    labPrincipalInvestigatorId: piId,
  }));

describe('TeamLabsCard', () => {
  it('renders the headline and description', () => {
    render(<TeamLabsCard labs={createLabs()} />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Labs' }),
    ).toBeVisible();
    expect(
      screen.getByText('View the labs that were part of this team.'),
    ).toBeVisible();
  });

  it('renders the correct description when the team is active', () => {
    render(<TeamLabsCard labs={createLabs()} isTeamActive={true} />);
    expect(
      screen.getByText(
        'View the labs within this team and connect directly with their principal investigators.',
      ),
    ).toBeVisible();
  });

  it('links to the user profile when labPrincipalInvestigatorId is present', () => {
    const labs = createLabs(1, 'user-id');
    render(<TeamLabsCard labs={labs} />);
    expect(screen.getByText('Lab 0').closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/user-id/),
    );
  });

  it('does not link to user profile when labPrincipalInvestigatorId is missing', () => {
    const labs = createLabs(1);
    render(<TeamLabsCard labs={labs} />);
    expect(screen.getByText('Lab 0').closest('a')).not.toBeInTheDocument();
  });

  it('renders a maximum of 8 labs initially', () => {
    const labs = createLabs(10);
    render(<TeamLabsCard labs={labs} />);

    // First 8 should be visible
    expect(screen.getByText('Lab 0')).toBeVisible();
    expect(screen.getByText('Lab 7')).toBeVisible();

    // 9th lab should not be visible (slice(0,8))
    expect(screen.queryByText('Lab 8')).not.toBeInTheDocument();
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
    expect(screen.getByText('Lab 8')).toBeVisible();
    expect(screen.getByText('Lab 9')).toBeVisible();

    // Button should be gone
    expect(
      screen.queryByRole('button', { name: /view more labs/i }),
    ).not.toBeInTheDocument();
  });
});
