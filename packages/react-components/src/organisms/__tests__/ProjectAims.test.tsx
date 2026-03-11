import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectAimsGrant } from '@asap-hub/model';
import ProjectAims from '../ProjectAims';

const mockSingleGrant: ProjectAimsGrant[] = [
  {
    grantTitle: 'Original Grant',
    aims: [
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
    ],
  },
];

const mockMultipleGrants: ProjectAimsGrant[] = [
  {
    grantTitle: 'Original Grant',
    aims: [
      {
        id: '1',
        order: 1,
        description: 'Grant one aim alpha',
        status: 'Complete',
        articleCount: 0,
      },
      {
        id: '2',
        order: 2,
        description: 'Grant one aim beta',
        status: 'In Progress',
        articleCount: 0,
      },
      {
        id: '3',
        order: 3,
        description: 'Grant one aim gamma',
        status: 'Pending',
        articleCount: 0,
      },
      {
        id: '4',
        order: 4,
        description: 'Grant one aim delta',
        status: 'Complete',
        articleCount: 0,
      },
      {
        id: '5',
        order: 5,
        description: 'Grant one aim epsilon',
        status: 'In Progress',
        articleCount: 0,
      },
    ],
  },
  {
    grantTitle: 'Supplement Grant',
    aims: [
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
    ],
  },
];

describe('ProjectAims', () => {
  it('renders aims title', () => {
    render(<ProjectAims aims={mockSingleGrant} />);
    expect(screen.getByText('Aims')).toBeInTheDocument();
  });

  it('renders description paragraph', () => {
    render(<ProjectAims aims={mockSingleGrant} />);
    expect(
      screen.getByText(/View the core research objectives/),
    ).toBeInTheDocument();
  });

  it('renders initial display count of aims', () => {
    render(<ProjectAims aims={mockSingleGrant} initialDisplayCount={3} />);
    expect(screen.getByText('First aim description')).toBeInTheDocument();
    expect(screen.getByText('Second aim description')).toBeInTheDocument();
    expect(screen.getByText('Third aim description')).toBeInTheDocument();
    expect(
      screen.queryByText('Fourth aim description'),
    ).not.toBeInTheDocument();
  });

  it('shows View More Aims button when there are more aims', () => {
    render(<ProjectAims aims={mockSingleGrant} initialDisplayCount={3} />);
    expect(screen.getByText('View More Aims')).toBeInTheDocument();
  });

  it('does not show View More Aims button when all aims are displayed', () => {
    render(<ProjectAims aims={mockSingleGrant} initialDisplayCount={10} />);
    expect(screen.queryByText('View More Aims')).not.toBeInTheDocument();
  });

  it('expands to show all aims when View More is clicked', async () => {
    render(<ProjectAims aims={mockSingleGrant} initialDisplayCount={2} />);

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
    render(<ProjectAims aims={mockSingleGrant} />);
    expect(screen.getByText('First aim description')).toBeInTheDocument();
    expect(screen.getByText('Fourth aim description')).toBeInTheDocument();
    expect(screen.queryByText('Fifth aim description')).not.toBeInTheDocument();
    expect(screen.getByText('View More Aims')).toBeInTheDocument();
  });

  it('renders nothing when aims array is empty', () => {
    const { container } = render(<ProjectAims aims={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when all grants have empty aims', () => {
    const { container } = render(
      <ProjectAims
        aims={[
          { grantTitle: 'Grant A', aims: [] },
          { grantTitle: 'Grant B', aims: [] },
        ]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  describe('tabs', () => {
    it('does not render tab buttons for single grant', () => {
      render(<ProjectAims aims={mockSingleGrant} />);
      expect(
        screen.queryByRole('button', { name: /Original Grant/i }),
      ).not.toBeInTheDocument();
    });

    it('renders tab buttons for multiple grants', () => {
      render(<ProjectAims aims={mockMultipleGrants} />);
      expect(screen.getByText('Original Grant (5)')).toBeInTheDocument();
      expect(screen.getByText('Supplement Grant (2)')).toBeInTheDocument();
    });

    it('switches displayed aims when tab is clicked', async () => {
      render(<ProjectAims aims={mockMultipleGrants} />);

      // First tab is active by default
      expect(screen.getByText('Grant one aim alpha')).toBeInTheDocument();
      expect(screen.queryByText('Grant two aim first')).not.toBeInTheDocument();

      // Click second tab
      await userEvent.click(screen.getByText('Supplement Grant (2)'));

      expect(screen.getByText('Grant two aim first')).toBeInTheDocument();
      expect(screen.getByText('Grant two aim second')).toBeInTheDocument();
      expect(screen.queryByText('Grant one aim alpha')).not.toBeInTheDocument();
    });

    it('maintains independent View More state per tab', async () => {
      render(<ProjectAims aims={mockMultipleGrants} initialDisplayCount={2} />);

      // Expand first tab
      expect(screen.queryByText('Grant one aim gamma')).not.toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: /View More Aims/i }),
      );
      expect(screen.getByText('Grant one aim gamma')).toBeInTheDocument();
      expect(screen.getByText('Grant one aim epsilon')).toBeInTheDocument();

      // Switch to second tab; it should be collapsed
      await userEvent.click(screen.getByText('Supplement Grant (2)'));
      expect(screen.getByText('Grant two aim first')).toBeInTheDocument();
      expect(screen.getByText('Grant two aim second')).toBeInTheDocument();
      // No View More since only 2 aims (equals initialDisplayCount)
      expect(screen.queryByText('View More Aims')).not.toBeInTheDocument();

      // Switch back to first tab; it should still be expanded
      await userEvent.click(screen.getByText('Original Grant (5)'));
      expect(screen.getByText('Grant one aim gamma')).toBeInTheDocument();
      expect(screen.getByText('Grant one aim epsilon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /View Less Aims/i }),
      ).toBeInTheDocument();
    });
  });
});
