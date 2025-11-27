import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OriginalGrantInfo, SupplementGrantInfo } from '@asap-hub/model';
import ProjectDetailOverview from '../ProjectDetailOverview';

const mockOriginalGrant: OriginalGrantInfo = {
  originalGrant: 'Original Grant Title',
  proposalId: 'proposal-1',
};

const mockSupplementGrant: SupplementGrantInfo = {
  grantTitle: 'Supplement Grant Title',
  grantDescription:
    'This is the supplement grant description with additional funding.',
  grantProposalId: 'proposal-2',
  grantStartDate: '2023-01-01',
  grantEndDate: '2025-12-31',
};
describe('ProjectDetailOverview', () => {
  it('renders Overview title', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders original grant description when no supplement grant', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    expect(
      screen.getByText(mockOriginalGrant.originalGrant),
    ).toBeInTheDocument();
  });

  it('renders Read Full Proposal button with correct link', () => {
    render(<ProjectDetailOverview originalGrant={mockOriginalGrant} />);
    const link = screen.getByRole('link', { name: /read full proposal/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      `/shared-research/${mockOriginalGrant.proposalId}`,
    );
  });

  it('does not render Read Full Proposal button when no URL provided', () => {
    const grantWithoutURL = { ...mockOriginalGrant, proposalId: undefined };
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
        screen.getByText(mockSupplementGrant.grantDescription || ''),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockOriginalGrant.originalGrant),
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
        screen.getByText(mockOriginalGrant.originalGrant),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockSupplementGrant.grantTitle),
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
      await act(async () => {
        await userEvent.click(originalGrantTab);
      });

      // Switch back to Supplement Grant
      const supplementGrantTab = screen.getByRole('button', {
        name: 'Supplement Grant',
      });

      await act(async () => {
        await userEvent.click(supplementGrantTab);
      });

      expect(
        screen.getByText(mockSupplementGrant.grantDescription || ''),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockOriginalGrant.originalGrant),
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
        `/shared-research/${mockSupplementGrant.grantProposalId}`,
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
        `/shared-research/${mockOriginalGrant.proposalId}`,
      );
    });
  });

  describe('without tabs', () => {
    it('does not render tabs when supplement grant has no title', () => {
      const supplementGrantNoTitle = {
        ...mockSupplementGrant,
        grantTitle: '',
      };
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
