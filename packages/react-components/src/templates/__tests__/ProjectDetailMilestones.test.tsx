import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
// import { ArticleItem } from '@asap-hub/model';

import ProjectDetailMilestones from '../ProjectDetailMilestones';

// const mockLoadArticleOptions = jest.fn(() => Promise.resolve([]));
// const pageControlsProps = {
//   numberOfPages: 3,
//   currentPageIndex: 1,
//   renderPageHref: (index: number) => `/page/${index}`,
// };

// const mockMilestones: Milestone[] = [
//   {
//     id: '1',
//     description: 'First milestone',
//     status: 'Complete',
//     articleCount: 0,
//     aims: '1',
//   },
//   {
//     id: '2',
//     description: 'Second milestone',
//     status: 'In Progress',
//     articleCount: 0,
//     aims: '2',
//   },
// ];

// const sampleArticles: ArticleItem[] = [
//   { id: '1', title: 'First article', href: '/articles/1' },
//   { id: '2', title: 'Second article', href: '/articles/2' },
// ];

// const mockFetchArticles = jest.fn(() => Promise.resolve(sampleArticles));

const defaultProps: ComponentProps<typeof ProjectDetailMilestones> = {
  selectedGrantType: 'original',
  onGrantTypeChange: () => null,
  hasSupplementGrant: false,
  children: <span>table</span>,
};

describe('ProjectDetailMilestones', () => {
  it('renders empty state when there are no milestones', () => {
    render(<ProjectDetailMilestones {...defaultProps} />);

    expect(screen.getByText('Milestones')).toBeInTheDocument();
    expect(
      screen.getByText(
        /These milestones track progress toward the objectives of the Original Grant/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Articles associated with a milestone may be added at any status/,
      ),
    ).toBeInTheDocument();

    // Page controls should not be rendered for empty state
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders the mobile fallback page', () => {
    render(<ProjectDetailMilestones {...defaultProps} />);

    expect(
      screen.getByText(/Milestones are only available/, { selector: 'span' }),
    ).toBeInTheDocument();
  });

  it('displays text for supplement grant type', () => {
    render(
      <ProjectDetailMilestones
        {...defaultProps}
        selectedGrantType={'supplement'}
      />,
    );

    expect(
      screen.getByText(
        /These milestones track progress toward the objectives of the Supplement Grant/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Supplement')).toBeInTheDocument();
  });
});
