import { act, fireEvent, render, screen } from '@testing-library/react';
import WorkingGroupOverview from '../WorkingGroupOverview';

describe('WorkingGroupOverview', () => {
  const defaultProps = {
    description: 'this is a description',
    primaryEmail: 'primary@example.com',
    milestones: [],
    members: [],
    tags: [],
  };

  it('renders the description', () => {
    render(<WorkingGroupOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Description' }),
    ).toBeInTheDocument();
  });

  it('renders the contact information', () => {
    render(<WorkingGroupOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Details' }),
    ).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        tags={[
          { id: 'tag-1', name: 'Tag 1' },
          { id: 'tag-2', name: 'Tag 2' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('does not render tags if empty', () => {
    render(<WorkingGroupOverview {...defaultProps} tags={[]} />);
    expect(
      screen.queryByRole('heading', { name: 'Tags' }),
    ).not.toBeInTheDocument();
  });

  describe('members section', () => {
    it('renders the members count in the title', () => {
      render(
        <WorkingGroupOverview
          {...defaultProps}
          members={[
            {
              userId: 'uuid-lead',
              firstName: 'Jane',
              lastName: 'Lead',
              displayName: 'Jane Lead',
              role: 'Lead',
            },
            {
              userId: 'uuid-member',
              firstName: 'John',
              lastName: 'Member',
              displayName: 'John Member',
              role: 'Working group member',
            },
          ]}
        />,
      );
      expect(screen.getByText('Working Group Members (2)')).toBeInTheDocument();
    });

    it('renders the member list if there are no members with count of 0', () => {
      render(<WorkingGroupOverview {...defaultProps} members={[]} />);
      expect(screen.getByText('Working Group Members (0)')).toBeInTheDocument();
    });

    describe('leaders section', () => {
      it('displays Lead and Co-lead roles in the Leaders section', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Lead',
              },
              {
                userId: 'uuid-colead',
                firstName: 'Bob',
                lastName: 'CoLead',
                displayName: 'Bob CoLead',
                role: 'Co-lead',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (2)')).toBeInTheDocument();
        expect(screen.getByText('Jane Lead')).toBeInTheDocument();
        expect(screen.getByText('Bob CoLead')).toBeInTheDocument();
      });

      it('puts leaders with inactiveSinceDate in the Past Leaders tab', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Lead',
                inactiveSinceDate: '2024-01-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Leaders (1)')).toBeInTheDocument();
        expect(screen.queryByText('Jane Lead')).toBeNull();

        act(() => {
          screen.getByText('Past Leaders (1)').click();
        });
        expect(screen.getByText('Jane Lead')).toBeVisible();
      });

      it('puts leaders with alumniSinceDate in the Past Leaders tab', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Co-lead',
                alumniSinceDate: '2023-06-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Leaders (1)')).toBeInTheDocument();
      });
    });

    describe('working group members section', () => {
      it('displays Working group member role in the Members section', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Working group member',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Members (1)')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Working group member')).toBeInTheDocument();
      });

      it('puts members with inactiveSinceDate in the Past Members tab', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Working group member',
                inactiveSinceDate: '2024-03-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Members (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Members (1)')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).toBeNull();

        act(() => {
          screen.getByText('Past Members (1)').click();
        });
        expect(screen.getByText('John Doe')).toBeVisible();
      });

      it('shows View More / View Less for members when count exceeds 8', () => {
        render(
          <WorkingGroupOverview
            {...defaultProps}
            members={Array.from({ length: 10 }, (_, i) => ({
              userId: `uuid-${i}`,
              firstName: `First${i}`,
              lastName: `Last${i}`,
              displayName: `User ${i}`,
              role: 'Working group member' as const,
            }))}
          />,
        );
        fireEvent.click(screen.getByText('View More Members'));
        expect(screen.getByText('View Less Members')).toBeVisible();
      });
    });

    it('does not show leaders in the Members section', () => {
      render(
        <WorkingGroupOverview
          {...defaultProps}
          members={[
            {
              userId: 'uuid-lead',
              firstName: 'Jane',
              lastName: 'Lead',
              displayName: 'Jane Lead',
              role: 'Lead',
            },
          ]}
        />,
      );
      expect(screen.getByText('Active Leaders (1)')).toBeInTheDocument();
      expect(screen.getByText('Active Members (0)')).toBeInTheDocument();
    });
  });

  it('renders the events', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        calendar={{ id: '42', name: 'test' }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Events' })).toBeVisible();
  });

  it('does not renders the events if there is no calendar', () => {
    render(<WorkingGroupOverview {...defaultProps} calendar={undefined} />);

    expect(
      screen.queryByRole('heading', { name: 'Events' }),
    ).not.toBeInTheDocument();
  });

  it('displays the milestones', () => {
    render(
      <WorkingGroupOverview
        {...defaultProps}
        milestones={[{ title: 'the milestone', status: 'Active' }]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Working Group Milestones (1)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the milestone/ }),
    ).toBeInTheDocument();
  });
});
