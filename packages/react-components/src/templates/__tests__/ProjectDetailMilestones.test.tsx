import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import ProjectDetailMilestones from '../ProjectDetailMilestones';

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

  it('renders original last updated date when viewing original grant', () => {
    render(
      <ProjectDetailMilestones
        {...defaultProps}
        selectedGrantType="original"
        milestonesLastUpdated={{
          original: '2025-04-01T00:00:00.000Z',
          supplement: '2025-06-01T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText(/Last Update:/)).toBeInTheDocument();
    expect(screen.getByText(/1st April 2025/)).toBeInTheDocument();
  });

  it('renders supplement last updated date when viewing supplement grant', () => {
    render(
      <ProjectDetailMilestones
        {...defaultProps}
        selectedGrantType="supplement"
        milestonesLastUpdated={{
          original: '2025-04-01T00:00:00.000Z',
          supplement: '2025-06-01T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText(/Last Update:/)).toBeInTheDocument();
    expect(screen.getByText(/1st June 2025/)).toBeInTheDocument();
  });

  it('does not render last updated bar when no date is provided for the selected grant type', () => {
    render(<ProjectDetailMilestones {...defaultProps} />);

    expect(screen.queryByText(/Last Update:/)).not.toBeInTheDocument();
  });
});
