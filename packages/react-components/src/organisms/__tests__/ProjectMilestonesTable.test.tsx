import { render, screen } from '@testing-library/react';
import { ArticleItem, Milestone } from '@asap-hub/model';
import ProjectMilestonesTable from '../ProjectMilestonesTable';

const mockLoadArticleOptions = jest.fn(() => Promise.resolve([]));
const mockOnSaveArticles = jest.fn(() => Promise.resolve());

const mockMilestones: Milestone[] = [
  {
    id: '1',
    description: 'First milestone',
    status: 'Complete',
    articleCount: 1,
  },
  {
    id: '2',
    description: 'Second milestone',
    status: 'In Progress',
    articleCount: 0,
  },
  {
    id: '3',
    description: 'Third milestone',
    status: 'Pending',
    articleCount: 0,
  },
  {
    id: '4',
    description: 'Fourth milestone',
    status: 'Terminated',
    articleCount: 2,
  },
  {
    id: '5',
    description: 'Fifth milestone',
    status: 'Terminated',
    articleCount: 0,
  },
];

const pageControlsProps = {
  numberOfPages: 3,
  currentPageIndex: 1,
  renderPageHref: (index: number) => `/page/${index}`,
};

const sampleArticles: ArticleItem[] = [
  { id: '1', title: 'First article', href: '/articles/1' },
  { id: '2', title: 'Second article', href: '/articles/2' },
];
const mockFetchArticles = jest.fn(() => Promise.resolve(sampleArticles));

describe('ProjectMilestonesTable', () => {
  beforeEach(() => {
    mockFetchArticles.mockClear();
    mockFetchArticles.mockResolvedValue(sampleArticles);
  });

  it('renders milestones table and pagination when milestones are provided', () => {
    render(
      <ProjectMilestonesTable
        milestones={mockMilestones}
        total={mockMilestones.length}
        hasAppliedSearch={false}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
        pageControlsProps={pageControlsProps}
        selectedGrantType={'original'}
      />,
    );

    // table column headers
    expect(screen.getAllByText('Aims').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Milestone').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Status').length).toBeGreaterThanOrEqual(1);

    // Milestone rows
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Second milestone')).toBeInTheDocument();
    expect(screen.getByText('5 results found')).toBeInTheDocument();

    // PageControls numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders all milestones', () => {
    render(
      <ProjectMilestonesTable
        milestones={mockMilestones}
        total={mockMilestones.length}
        hasAppliedSearch={false}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
        pageControlsProps={pageControlsProps}
        selectedGrantType={'original'}
      />,
    );
    expect(screen.getByText('First milestone')).toBeInTheDocument();
    expect(screen.getByText('Second milestone')).toBeInTheDocument();
    expect(screen.getByText('Third milestone')).toBeInTheDocument();
    expect(screen.getByText('Fourth milestone')).toBeInTheDocument();
    expect(screen.getByText('Fifth milestone')).toBeInTheDocument();
  });

  it('renders empty state when there are no milestones', () => {
    render(
      <ProjectMilestonesTable
        milestones={[]}
        total={0}
        hasAppliedSearch={false}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
        pageControlsProps={pageControlsProps}
        selectedGrantType={'original'}
      />,
    );
    expect(
      screen.getByText(
        'No milestones related to the Original Grant have been added to this project yet.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('0 results found')).not.toBeInTheDocument();
  });

  it('renders search empty state when no milestones match the current search', () => {
    render(
      <ProjectMilestonesTable
        milestones={[]}
        total={0}
        hasAppliedSearch={true}
        isLead={false}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        pageControlsProps={pageControlsProps}
        selectedGrantType={'original'}
      />,
    );

    expect(screen.getByText('0 results found')).toBeInTheDocument();
    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please double-check your search for any typos or try a different search term.',
      ),
    ).toBeInTheDocument();
  });

  it('passes onSaveArticles down to each Milestone row', async () => {
    render(
      <ProjectMilestonesTable
        milestones={[mockMilestones[0]!]}
        isLead={true}
        loadArticleOptions={mockLoadArticleOptions}
        fetchLinkedArticles={mockFetchArticles}
        onSaveArticles={mockOnSaveArticles}
        pageControlsProps={pageControlsProps}
        selectedGrantType={'original'}
      />,
    );
    expect(
      screen.getByRole('button', { name: /edit/i }),
    ).toBeInTheDocument();
  });
});
