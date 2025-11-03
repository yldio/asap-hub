import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GrantInfo } from '@asap-hub/model';
import ProjectDetailOverview from '../ProjectDetailOverview';

const mockOriginalGrant: GrantInfo = {
  title: 'Original Grant Title',
  description: 'This is the original grant description explaining the project.',
  proposalURL: 'https://example.com/original-proposal',
};

const mockSupplementGrant: GrantInfo = {
  title: 'Supplement Grant Title',
  description:
    'This is the supplement grant description with additional funding.',
  proposalURL: 'https://example.com/supplement-proposal',
};

describe('ProjectDetailOverview', () => {
  it('renders Overview title', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders original grant description when no supplement grant', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    expect(screen.getByText(mockOriginalGrant.description)).toBeInTheDocument();
  });

  it('renders Read Full Proposal button with correct link', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    const link = screen.getByRole('link', { name: /read full proposal/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', mockOriginalGrant.proposalURL);
  });

  it('does not render Read Full Proposal button when no URL provided', () => {
    const grantWithoutURL = { ...mockOriginalGrant, proposalURL: undefined };
    render(<ProjectDetailOverview originalGrant={grantWithoutURL} />);
    expect(
      screen.queryByRole('link', { name: /read full proposal/i }),
    ).not.toBeInTheDocument();
  });

  describe('with supplement grant', () => {
    it('renders grant tabs when supplement grant exists', () => {
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={mockSupplementGrant}
        />,
      );
      expect(screen.getByText('Supplement Grant')).toBeInTheDocument();
      expect(screen.getByText('Original Grant')).toBeInTheDocument();
    });

    it('displays supplement grant content by default', () => {
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={mockSupplementGrant}
        />,
      );
      expect(
        screen.getByText(mockSupplementGrant.description),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockOriginalGrant.description),
      ).not.toBeInTheDocument();
    });

    it('switches to original grant when tab is clicked', async () => {
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={mockSupplementGrant}
        />,
      );

      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);

      expect(
        screen.getByText(mockOriginalGrant.description),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockSupplementGrant.description),
      ).not.toBeInTheDocument();
    });

    it('switches back to supplement grant when tab is clicked', async () => {
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={mockSupplementGrant}
        />,
      );

      // Switch to Original Grant
      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);

      // Switch back to Supplement Grant
      const supplementGrantTab = screen.getByRole('button', {
        name: 'Supplement Grant',
      });
      await userEvent.click(supplementGrantTab);

      expect(
        screen.getByText(mockSupplementGrant.description),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockOriginalGrant.description),
      ).not.toBeInTheDocument();
    });

    it('renders proposal links for each grant', async () => {
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={mockSupplementGrant}
        />,
      );

      // Check supplement grant link
      let proposalLink = screen.getByRole('link', {
        name: /read full proposal/i,
      });
      expect(proposalLink).toHaveAttribute(
        'href',
        mockSupplementGrant.proposalURL,
      );

      // Switch to Original Grant
      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);

      // Check original grant link
      proposalLink = screen.getByRole('link', { name: /read full proposal/i });
      expect(proposalLink).toHaveAttribute(
        'href',
        mockOriginalGrant.proposalURL,
      );
    });
  });

  describe('without tabs', () => {
    it('does not render tabs when supplement grant has no title', () => {
      const supplementGrantNoTitle = { ...mockSupplementGrant, title: '' };
      render(
        <ProjectDetailOverview
          originalGrant={mockOriginalGrant}
          supplementGrant={supplementGrantNoTitle}
        />,
      );
      expect(screen.queryByText('Supplement Grant')).not.toBeInTheDocument();
      expect(screen.queryByText('Original Grant')).not.toBeInTheDocument();
    });
  });
});
