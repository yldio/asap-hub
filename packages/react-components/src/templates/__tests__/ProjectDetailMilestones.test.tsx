import { ComponentProps } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Aim } from '@asap-hub/model';

import ProjectDetailMilestones from '../ProjectDetailMilestones';

const mockAims: Aim[] = [
  {
    id: '1',
    order: 1,
    description: 'Aim Description One',
    status: 'In Progress',
    articleCount: 0,
  },
  {
    id: '2',
    order: 2,
    description: 'Aim Description Two',
    status: 'Complete',
    articleCount: 2,
  },
];

const defaultProps: ComponentProps<typeof ProjectDetailMilestones> = {
  isLead: true,
  selectedGrantType: 'original',
  onGrantTypeChange: () => null,
  hasSupplementGrant: false,
  aims: mockAims,

  loadArticleOptions: jest.fn().mockResolvedValue([]),

  onCreateProjectMilestone: jest.fn().mockResolvedValue('milestone-id'),
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

  describe('Add New Milestone button visibility', () => {
    describe('button is visible when', () => {
      it.each`
        isLead  | selectedGrantType | hasSupplementGrant
        ${true} | ${'original'}     | ${false}
        ${true} | ${'supplement'}   | ${true}
        ${true} | ${'supplement'}   | ${false}
      `(
        'isLead=$isLead, grant=$selectedGrantType, hasSupplementGrant=$hasSupplementGrant',
        ({ isLead, selectedGrantType, hasSupplementGrant }) => {
          render(
            <ProjectDetailMilestones
              {...defaultProps}
              isLead={isLead}
              selectedGrantType={selectedGrantType}
              hasSupplementGrant={hasSupplementGrant}
            />,
          );

          expect(
            screen.getByRole('button', { name: /add new milestone/i }),
          ).toBeInTheDocument();
        },
      );
    });

    describe('button is not visible when', () => {
      it.each`
        isLead   | selectedGrantType | hasSupplementGrant
        ${true}  | ${'original'}     | ${true}
        ${false} | ${'original'}     | ${false}
        ${false} | ${'supplement'}   | ${true}
      `(
        'isLead=$isLead, grant=$selectedGrantType, hasSupplementGrant=$hasSupplementGrant',
        ({ isLead, selectedGrantType, hasSupplementGrant }) => {
          render(
            <ProjectDetailMilestones
              {...defaultProps}
              isLead={isLead}
              selectedGrantType={selectedGrantType}
              hasSupplementGrant={hasSupplementGrant}
            />,
          );

          expect(
            screen.queryByRole('button', { name: /add new milestone/i }),
          ).not.toBeInTheDocument();
        },
      );
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    render(<ProjectDetailMilestones {...defaultProps} />);

    const addNewMilestoneButton = await screen.findByRole('button', {
      name: /Add New Milestone/i,
    });

    await userEvent.click(addNewMilestoneButton);

    expect(screen.getByText(/Milestone Description/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
    });
    await userEvent.click(cancelButton);
    expect(
      screen.queryByText(/Milestone Description/i),
    ).not.toBeInTheDocument();
  });

  it('can create a milestone when the data is valid', async () => {
    const mockOnCreateProjectMilestone = jest
      .fn()
      .mockResolvedValue('milestone-id');
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProjectDetailMilestones
          {...defaultProps}
          onCreateProjectMilestone={mockOnCreateProjectMilestone}
        />
      </MemoryRouter>,
    );

    const addNewMilestoneButton = await screen.findByRole('button', {
      name: /Add New Milestone/i,
    });

    await userEvent.click(addNewMilestoneButton);

    await userEvent.type(
      screen.getByRole('textbox', { name: /Description/i }),
      'Some description',
    );

    await userEvent.click(screen.getByRole('button', { name: '#1' }));

    const submitButton = await screen.findByRole('button', {
      name: 'Confirm',
    });
    await userEvent.click(submitButton);

    const confirmButton = await screen.findByRole('button', {
      name: /confirm and notify/i,
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnCreateProjectMilestone).toHaveBeenCalledWith({
        description: 'Some description',
        status: 'Pending',
        grantType: 'original',
        relatedArticleIds: [],
        aimIds: ['1'],
      });
    });
  });
});
