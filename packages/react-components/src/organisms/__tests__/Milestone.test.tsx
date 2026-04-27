import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ArticleItem,
  Milestone as MilestoneType,
  MilestoneStatus,
} from '@asap-hub/model';
import Milestone, { getMilestoneStatusAccent } from '../Milestone';

const mockLoadArticleOptions = jest.fn(() => Promise.resolve([]));
const mockOnSaveArticles = jest.fn(() => Promise.resolve());

const mockMilestone: MilestoneType = {
  id: '1',
  description: 'This is a test milestone description',
  status: 'Complete',
  articleCount: 0,
};

const longMilestone: MilestoneType = {
  id: '2',
  description:
    'This is a very long milestone description that exceeds the character limit and should be truncated with a Read More button to allow users to expand and see the full content.',
  status: 'In Progress',
  articleCount: 0,
};

const mockFetchArticles = jest.fn(() => Promise.resolve([]));

// Mock scrollHeight and clientHeight to simulate truncation
const mockScrollHeight = (element: HTMLElement, scrollHeight: number) => {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
};

const mockClientHeight = (element: HTMLElement, clientHeight: number) => {
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
};

describe('Milestone', () => {
  it('renders milestone description', () => {
    render(
      <Milestone
        milestone={mockMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );
    expect(screen.getByText(mockMilestone.description)).toBeInTheDocument();
  });

  it('renders milestone status pill', () => {
    render(
      <Milestone
        milestone={mockMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('renders aim badges from aims string', () => {
    render(
      <Milestone
        milestone={{
          ...mockMilestone,
          aims: '1,2',
        }}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('renders nothing in Aims column when aims is empty or missing', () => {
    render(
      <Milestone
        milestone={mockMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );
    expect(screen.queryByText('—')).not.toBeInTheDocument();
    expect(screen.queryByText('#1')).not.toBeInTheDocument();
  });

  it('truncates long descriptions and shows Read More button', async () => {
    render(
      <Milestone
        milestone={longMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );

    const descriptionDiv = screen.getByText(longMilestone.description);
    mockScrollHeight(descriptionDiv, 100);
    mockClientHeight(descriptionDiv, 48);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /Read Less/i }),
    ).not.toBeInTheDocument();
  });

  it('expands description when Read More is clicked', async () => {
    render(
      <Milestone
        milestone={longMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );

    const descriptionDiv = screen.getByText(longMilestone.description);
    mockScrollHeight(descriptionDiv, 100);
    mockClientHeight(descriptionDiv, 48);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });

    const readMoreButton = screen.getByRole('button', { name: /Read More/i });
    await userEvent.click(readMoreButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read Less/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read More/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByText(longMilestone.description)).toBeInTheDocument();
    });
  });

  it('collapses description when Read Less is clicked', async () => {
    render(
      <Milestone
        milestone={longMilestone}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
      />,
    );

    const descriptionDiv = screen.getByText(longMilestone.description);
    mockScrollHeight(descriptionDiv, 100);
    mockClientHeight(descriptionDiv, 48);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });

    const readMoreButton = screen.getByRole('button', { name: /Read More/i });
    await userEvent.click(readMoreButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read Less/i }),
      ).toBeInTheDocument();
    });

    const readLessButton = screen.getByRole('button', { name: /Read Less/i });
    await userEvent.click(readLessButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read Less/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('articles section', () => {
    const milestoneWithArticles: MilestoneType = {
      ...mockMilestone,
      articleCount: 2,
    };
    const sampleArticles: ArticleItem[] = [
      {
        id: 'a1',
        title: 'Article 1',
        href: '/shared-research/a1',
        type: 'Preprint',
      },
      {
        id: 'a2',
        title: 'Article 2',
        href: '/shared-research/a2',
        type: 'Published',
      },
    ];

    const mockFetchLinkedArticles = jest.fn(() =>
      Promise.resolve(sampleArticles),
    );

    it('displays "No articles added" when no related articles', () => {
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      expect(screen.getByText('No articles added')).toBeInTheDocument();
    });

    it('displays article count with expand button when articles exist', () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      expect(screen.getByText('Articles (2)')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /expand articles/i }),
      ).toBeInTheDocument();
    });

    it('expands article list when plus icon is clicked', async () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(
        screen.getByRole('button', { name: /expand articles/i }),
      );
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 2')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /collapse articles/i }),
      ).toBeInTheDocument();
    });

    it('collapses article list when minus icon is clicked', async () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(
        screen.getByRole('button', { name: /expand articles/i }),
      );
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: /collapse articles/i }),
      );
      expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
    });

    it('does not show Edit button when isLead is false', () => {
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      expect(
        screen.queryByRole('button', { name: /edit/i }),
      ).not.toBeInTheDocument();
    });

    it('shows Edit button when isLead is true and no articles', () => {
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('shows Edit button when isLead is true and articles exist', () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('opens modal when Edit is clicked with no articles', async () => {
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add Related Articles')).toBeInTheDocument();
    });

    it('closes modal when Cancel is clicked', async () => {
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens Edit modal with correct title when articles exist', async () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByText('Edit Related Articles')).toBeInTheDocument();
    });

    it('renders article titles as links with correct hrefs when expanded', async () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={false}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(
        screen.getByRole('button', { name: /expand articles/i }),
      );
      expect(screen.getByRole('link', { name: 'Article 1' })).toHaveAttribute(
        'href',
        '/shared-research/a1',
      );
      expect(screen.getByRole('link', { name: 'Article 2' })).toHaveAttribute(
        'href',
        '/shared-research/a2',
      );
    });

    it('calls fetchLinkedArticles with milestone id when Edit is clicked with existing articles', async () => {
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(mockFetchLinkedArticles).toHaveBeenCalledWith(
        milestoneWithArticles.id,
      );
    });

    it('re-fetches articles when Edit is opened a second time after saving', async () => {
      const localFetchMock = jest.fn(() => Promise.resolve(sampleArticles));
      mockOnSaveArticles.mockResolvedValueOnce(undefined);
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={localFetchMock}
          onSaveArticles={mockOnSaveArticles}
        />,
      );

      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(localFetchMock).toHaveBeenCalledTimes(1);

      await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(localFetchMock).toHaveBeenCalledTimes(2);
    });

    it('closes modal immediately on confirm even when save fails', async () => {
      mockOnSaveArticles.mockRejectedValueOnce(new Error('save failed'));
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );

      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('displays saved articles in list after confirming modal', async () => {
      mockOnSaveArticles.mockResolvedValueOnce(undefined);
      render(
        <Milestone
          milestone={milestoneWithArticles}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchLinkedArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      await userEvent.click(
        screen.getByRole('button', { name: /expand articles/i }),
      );
      expect(screen.getByRole('link', { name: 'Article 1' })).toHaveAttribute(
        'href',
        '/shared-research/a1',
      );
      expect(screen.getByRole('link', { name: 'Article 2' })).toHaveAttribute(
        'href',
        '/shared-research/a2',
      );
    });

    it('calls onSaveArticles and closes modal when Confirm is clicked', async () => {
      mockOnSaveArticles.mockResolvedValueOnce(undefined);
      render(
        <Milestone
          milestone={mockMilestone}
          isLead={true}
          loadArticleOptions={mockLoadArticleOptions}
          fetchLinkedArticles={mockFetchArticles}
          onSaveArticles={mockOnSaveArticles}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(mockOnSaveArticles).toHaveBeenCalledWith('1', []);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('getMilestoneStatusAccent', () => {
    it('returns success for Complete status', () => {
      expect(getMilestoneStatusAccent('Complete')).toBe('success');
    });

    it('returns info for In Progress status', () => {
      expect(getMilestoneStatusAccent('In Progress')).toBe('info');
    });

    it('returns neutral for Pending status', () => {
      expect(getMilestoneStatusAccent('Pending')).toBe('neutral');
    });

    it('returns error for Terminated status', () => {
      expect(getMilestoneStatusAccent('Terminated')).toBe('error');
    });

    it('returns default for unknown status', () => {
      expect(
        getMilestoneStatusAccent('Unknown' as unknown as MilestoneStatus),
      ).toBe('default');
    });
  });
});
