import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProjectProfileOverview from '../ProjectProfileOverview';

const baseProps = {
  projectTitle: 'Test Project Title',
  projectSummary:
    'This is a detailed project summary that describes the project goals and objectives.',
  proposalURL: 'proposal-123',
};

const supplementGrant = {
  title: 'Supplement Grant Title',
  description:
    'This is the supplement grant description with additional funding details.',
  proposalURL: 'supplement-proposal-456',
};

describe('ProjectProfileOverview', () => {
  describe('Basic rendering', () => {
    it('renders "Project Overview" title', () => {
      render(<ProjectProfileOverview {...baseProps} />);
      expect(screen.getByText('Project Overview')).toBeInTheDocument();
    });

    it('renders project title and summary', () => {
      render(<ProjectProfileOverview {...baseProps} />);
      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
      expect(screen.getByText(baseProps.projectSummary)).toBeInTheDocument();
    });

    it('renders Read Full Proposal button with correct link when proposalURL is provided', () => {
      render(<ProjectProfileOverview {...baseProps} />);
      const link = screen.getByRole('link', { name: /read full proposal/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('proposal-123'),
      );
    });

    it('does not render Read Full Proposal button when proposalURL is not provided', () => {
      render(<ProjectProfileOverview {...baseProps} proposalURL={undefined} />);
      expect(
        screen.queryByRole('link', { name: /read full proposal/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Without supplement grant', () => {
    it('renders project content directly without tabs', () => {
      render(<ProjectProfileOverview {...baseProps} />);
      expect(screen.queryByText('Supplement Grant')).not.toBeInTheDocument();
      expect(screen.queryByText('Original Grant')).not.toBeInTheDocument();
      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
      expect(screen.getByText(baseProps.projectSummary)).toBeInTheDocument();
    });
  });

  describe('With supplement grant', () => {
    it('renders grant tabs when supplement grant has title', () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );
      expect(screen.getByText('Supplement Grant')).toBeInTheDocument();
      expect(screen.getByText('Original Grant')).toBeInTheDocument();
    });

    it('displays supplement grant content by default', () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );
      expect(screen.getByText(supplementGrant.title)).toBeInTheDocument();
      expect(screen.getByText(supplementGrant.description)).toBeInTheDocument();
      expect(screen.queryByText('Test Project Title')).not.toBeInTheDocument();
      expect(
        screen.queryByText(baseProps.projectSummary),
      ).not.toBeInTheDocument();
    });

    it('renders Read Full Proposal button for supplement grant by default', () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );
      const link = screen.getByRole('link', { name: /read full proposal/i });
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('supplement-proposal-456'),
      );
    });

    it('switches to original grant when Original Grant tab is clicked', async () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );

      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);

      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
      expect(screen.getByText(baseProps.projectSummary)).toBeInTheDocument();
      expect(screen.queryByText(supplementGrant.title)).not.toBeInTheDocument();
      expect(
        screen.queryByText(supplementGrant.description),
      ).not.toBeInTheDocument();
    });

    it('renders Read Full Proposal button for original grant when switched to Original Grant tab', async () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );

      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);

      const link = screen.getByRole('link', { name: /read full proposal/i });
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('proposal-123'),
      );
    });

    it('switches back to supplement grant when Supplement Grant tab is clicked', async () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );

      // Switch to Original Grant first
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

      expect(screen.getByText(supplementGrant.title)).toBeInTheDocument();
      expect(screen.getByText(supplementGrant.description)).toBeInTheDocument();
      expect(screen.queryByText('Test Project Title')).not.toBeInTheDocument();
      expect(
        screen.queryByText(baseProps.projectSummary),
      ).not.toBeInTheDocument();
    });

    it('maintains tab state correctly during multiple switches', async () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );

      // Start with Supplement Grant (default)
      expect(screen.getByText(supplementGrant.title)).toBeInTheDocument();

      // Switch to Original Grant
      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      await userEvent.click(originalGrantTab);
      expect(screen.getByText('Test Project Title')).toBeInTheDocument();

      // Switch back to Supplement Grant
      const supplementGrantTab = screen.getByRole('button', {
        name: 'Supplement Grant',
      });
      await userEvent.click(supplementGrantTab);
      expect(screen.getByText(supplementGrant.title)).toBeInTheDocument();

      // Switch to Original Grant again
      await userEvent.click(originalGrantTab);
      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
    });
  });

  describe('Supplement grant without title', () => {
    it('does not render tabs when supplement grant has no title', () => {
      const supplementGrantNoTitle = {
        ...supplementGrant,
        title: '',
      };

      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrantNoTitle}
        />,
      );
      expect(screen.queryByText('Supplement Grant')).not.toBeInTheDocument();
      expect(screen.queryByText('Original Grant')).not.toBeInTheDocument();
      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
      expect(screen.getByText(baseProps.projectSummary)).toBeInTheDocument();
    });

    it('does not render tabs when supplement grant title is empty', () => {
      const supplementGrantNoTitle = {
        ...supplementGrant,
        title: '',
      };

      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrantNoTitle}
        />,
      );
      expect(screen.queryByText('Supplement Grant')).not.toBeInTheDocument();
      expect(screen.queryByText('Original Grant')).not.toBeInTheDocument();
    });
  });

  describe('Supplement grant without proposal URL', () => {
    it('does not render Read Full Proposal button for supplement grant when proposalURL is not provided', () => {
      const supplementGrantNoURL = {
        ...supplementGrant,
        proposalURL: undefined,
      };

      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrantNoURL}
        />,
      );
      expect(
        screen.queryByRole('link', { name: /read full proposal/i }),
      ).not.toBeInTheDocument();
    });

    it('renders Read Full Proposal button for original grant even when supplement grant has no URL', () => {
      const supplementGrantNoURL = {
        ...supplementGrant,
        proposalURL: undefined,
      };

      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrantNoURL}
        />,
      );

      const originalGrantTab = screen.getByRole('button', {
        name: 'Original Grant',
      });
      userEvent.click(originalGrantTab);

      const link = screen.getByRole('link', { name: /read full proposal/i });
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('proposal-123'),
      );
    });
  });

  describe('Accessibility', () => {
    it('renders tab buttons with correct roles', () => {
      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrant}
        />,
      );

      const supplementTab = screen.getByRole('button', {
        name: 'Supplement Grant',
      });
      const originalTab = screen.getByRole('button', {
        name: 'Original Grant',
      });

      expect(supplementTab).toBeInTheDocument();
      expect(originalTab).toBeInTheDocument();
    });

    it('renders links with correct roles', () => {
      render(<ProjectProfileOverview {...baseProps} />);
      const link = screen.getByRole('link', { name: /read full proposal/i });
      expect(link).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles empty project title gracefully', () => {
      render(<ProjectProfileOverview {...baseProps} projectTitle="" />);
      expect(screen.getByText('Project Overview')).toBeInTheDocument();
    });

    it('handles empty project summary gracefully', () => {
      render(<ProjectProfileOverview {...baseProps} projectSummary="" />);
      expect(screen.getByText('Project Overview')).toBeInTheDocument();
    });

    it('handles supplement grant with empty description', () => {
      const supplementGrantEmptyDesc = {
        ...supplementGrant,
        description: '',
      };

      render(
        <ProjectProfileOverview
          {...baseProps}
          supplementGrant={supplementGrantEmptyDesc}
        />,
      );
      expect(screen.getByText(supplementGrant.title)).toBeInTheDocument();
    });
  });
});
