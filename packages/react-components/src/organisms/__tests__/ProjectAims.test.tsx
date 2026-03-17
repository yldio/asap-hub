import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Aim } from '@asap-hub/model';
import ProjectAims from '../ProjectAims';

const mockFetchArticles = jest.fn(() => Promise.resolve([]));

const mockOriginalGrantAims: Aim[] = [
  {
    id: '1',
    order: 1,
    description: 'First aim description',
    status: 'Complete',
    articleCount: 2,
  },
  {
    id: '2',
    order: 2,
    description: 'Second aim description',
    status: 'In Progress',
    articleCount: 0,
  },
  {
    id: '3',
    order: 3,
    description: 'Third aim description',
    status: 'Pending',
    articleCount: 1,
  },
  {
    id: '4',
    order: 4,
    description: 'Fourth aim description',
    status: 'Terminated',
    articleCount: 0,
  },
  {
    id: '5',
    order: 5,
    description: 'Fifth aim description',
    status: 'Complete',
    articleCount: 3,
  },
];

const mockSupplementGrantAims: Aim[] = [
  {
    id: '6',
    order: 1,
    description: 'Grant two aim first',
    status: 'Pending',
    articleCount: 0,
  },
  {
    id: '7',
    order: 2,
    description: 'Grant two aim second',
    status: 'Complete',
    articleCount: 0,
  },
];

describe('ProjectAims', () => {
  it('renders aims title', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.getByText('Aims')).toBeInTheDocument();
  });

  it('renders description paragraph', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(
      screen.getByText(/View the core research objectives/),
    ).toBeInTheDocument();
  });

  it('renders initial display count of aims', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        initialDisplayCount={3}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.getByText('First aim description')).toBeInTheDocument();
    expect(screen.getByText('Second aim description')).toBeInTheDocument();
    expect(screen.getByText('Third aim description')).toBeInTheDocument();
    expect(
      screen.queryByText('Fourth aim description'),
    ).not.toBeInTheDocument();
  });

  it('shows View More Aims button when there are more aims', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        initialDisplayCount={3}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.getByText('View More Aims')).toBeInTheDocument();
  });

  it('does not show View More Aims button when all aims are displayed', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        initialDisplayCount={10}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.queryByText('View More Aims')).not.toBeInTheDocument();
  });

  it('expands to show all aims when View More is clicked', async () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        initialDisplayCount={2}
        fetchArticles={mockFetchArticles}
      />,
    );

    expect(screen.queryByText('Third aim description')).not.toBeInTheDocument();

    const viewMoreButton = screen.getByRole('button', {
      name: /View More Aims/i,
    });
    await userEvent.click(viewMoreButton);

    expect(screen.getByText('Third aim description')).toBeInTheDocument();
    expect(screen.getByText('Fourth aim description')).toBeInTheDocument();
    expect(screen.getByText('Fifth aim description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View Less Aims/i }),
    ).toBeInTheDocument();
  });

  it('uses default initialDisplayCount of 4', () => {
    render(
      <ProjectAims
        originalGrantAims={mockOriginalGrantAims}
        supplementGrantAims={[]}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.getByText('First aim description')).toBeInTheDocument();
    expect(screen.getByText('Fourth aim description')).toBeInTheDocument();
    expect(screen.queryByText('Fifth aim description')).not.toBeInTheDocument();
    expect(screen.getByText('View More Aims')).toBeInTheDocument();
  });

  it('renders nothing when both aims arrays are empty', () => {
    const { container } = render(
      <ProjectAims
        originalGrantAims={[]}
        supplementGrantAims={[]}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  describe('tabs', () => {
    it('does not render tab buttons when only original grant has aims', () => {
      render(
        <ProjectAims
          originalGrantAims={mockOriginalGrantAims}
          supplementGrantAims={[]}
          fetchArticles={mockFetchArticles}
        />,
      );
      expect(
        screen.queryByRole('button', { name: /Original Grant/i }),
      ).not.toBeInTheDocument();
    });

    it('renders tab buttons when both grants have aims', () => {
      render(
        <ProjectAims
          originalGrantAims={mockOriginalGrantAims}
          supplementGrantAims={mockSupplementGrantAims}
          fetchArticles={mockFetchArticles}
        />,
      );
      expect(screen.getByText('Original Grant (5)')).toBeInTheDocument();
      expect(screen.getByText('Supplement Grant (2)')).toBeInTheDocument();
    });

    it('switches displayed aims when tab is clicked', async () => {
      render(
        <ProjectAims
          originalGrantAims={mockOriginalGrantAims}
          supplementGrantAims={mockSupplementGrantAims}
          fetchArticles={mockFetchArticles}
        />,
      );

      // Supplement Grant tab is active by default
      expect(screen.getByText('Grant two aim first')).toBeInTheDocument();
      expect(
        screen.queryByText('First aim description'),
      ).not.toBeInTheDocument();

      // Click Original Grant tab
      await userEvent.click(screen.getByText('Original Grant (5)'));

      expect(screen.getByText('First aim description')).toBeInTheDocument();
      expect(screen.getByText('Second aim description')).toBeInTheDocument();
      expect(screen.queryByText('Grant two aim first')).not.toBeInTheDocument();
    });

    it('maintains independent View More state per tab', async () => {
      render(
        <ProjectAims
          originalGrantAims={mockOriginalGrantAims}
          supplementGrantAims={mockSupplementGrantAims}
          initialDisplayCount={2}
          fetchArticles={mockFetchArticles}
        />,
      );

      // Supplement Grant tab is active by default, only 2 aims so no View More
      expect(screen.getByText('Grant two aim first')).toBeInTheDocument();
      expect(screen.getByText('Grant two aim second')).toBeInTheDocument();
      expect(screen.queryByText('View More Aims')).not.toBeInTheDocument();

      // Switch to Original Grant tab
      await userEvent.click(screen.getByText('Original Grant (5)'));
      expect(screen.getByText('First aim description')).toBeInTheDocument();
      expect(
        screen.queryByText('Third aim description'),
      ).not.toBeInTheDocument();

      // Expand Original Grant tab
      await userEvent.click(
        screen.getByRole('button', { name: /View More Aims/i }),
      );
      expect(screen.getByText('Third aim description')).toBeInTheDocument();
      expect(screen.getByText('Fifth aim description')).toBeInTheDocument();

      // Switch to Supplement Grant tab; it should still be collapsed
      await userEvent.click(screen.getByText('Supplement Grant (2)'));
      expect(screen.getByText('Grant two aim first')).toBeInTheDocument();
      expect(screen.getByText('Grant two aim second')).toBeInTheDocument();

      // Switch back to Original Grant; it should still be expanded
      await userEvent.click(screen.getByText('Original Grant (5)'));
      expect(screen.getByText('Third aim description')).toBeInTheDocument();
      expect(screen.getByText('Fifth aim description')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /View Less Aims/i }),
      ).toBeInTheDocument();
    });
  });
});
