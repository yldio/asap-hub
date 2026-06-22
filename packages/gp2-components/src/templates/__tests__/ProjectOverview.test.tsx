import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ProjectOverview from '../ProjectOverview';

const mockIsEnabled = jest.fn();
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

beforeEach(() => {
  mockIsEnabled.mockReturnValue(true);
});

describe('ProjectOverview', () => {
  const defaultProps: ComponentProps<typeof ProjectOverview> = {
    status: 'Active',
    tags: [],
    milestones: [],
    members: [],
    pmEmail: 'tony@stark.com',
  };
  it('renders the description', () => {
    const description = 'this is a description';
    render(<ProjectOverview {...defaultProps} description={description} />);
    expect(
      screen.getByRole('heading', { name: 'Description' }),
    ).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
  it('does not render the description if unavailable', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.queryByRole('heading', { name: 'Description' }),
    ).not.toBeInTheDocument();
  });
  it('renders the contact information', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Details' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'PM Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
    ).toBeInTheDocument();
  });
  it('renders the lead email information', () => {
    render(
      <ProjectOverview {...defaultProps} leadEmail={'peter@parker.com'} />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Lead Email' }),
    ).toBeInTheDocument();
  });
  it('renders both the lead email and PM email information', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        pmEmail={'tony@stark.com'}
        leadEmail={'peter@parker.com'}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Lead Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'PM Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
    ).toBeInTheDocument();
  });
  it('renders the tags', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        tags={[
          { id: 'tag-1', name: 'Tag 1' },
          { id: 'tag-2', name: 'Tag 2' },
        ]}
      >
        Body
      </ProjectOverview>,
    );
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });
  it('does not render tags if empty', () => {
    render(<ProjectOverview {...defaultProps} tags={[]} />);
    expect(
      screen.queryByRole('heading', { name: 'Tags' }),
    ).not.toBeInTheDocument();
  });

  it('displays the milestones', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        milestones={[{ title: 'the milestone', status: 'Active' }]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (1)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the milestone/ }),
    ).toBeInTheDocument();
  });

  describe('members section', () => {
    it('renders the members count in the title', () => {
      render(
        <ProjectOverview
          {...defaultProps}
          members={[
            {
              userId: 'uuid-lead',
              firstName: 'Jane',
              lastName: 'Lead',
              displayName: 'Jane Lead',
              role: 'Project lead',
            },
            {
              userId: 'uuid-member',
              firstName: 'John',
              lastName: 'Member',
              displayName: 'John Member',
              role: 'Contributor',
            },
          ]}
        />,
      );
      expect(screen.getByText('Project Members (2)')).toBeInTheDocument();
    });

    it('renders the member list with count of 0 even if there are no members', () => {
      render(<ProjectOverview {...defaultProps} members={[]} />);
      expect(screen.getByText('Project Members (0)')).toBeInTheDocument();
    });

    describe('leaders section', () => {
      it('displays Project lead, Project co-lead and Project manager roles in the Leaders section', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project lead',
              },
              {
                userId: 'uuid-colead',
                firstName: 'Bob',
                lastName: 'CoLead',
                displayName: 'Bob CoLead',
                role: 'Project co-lead',
              },
              {
                userId: 'uuid-manager',
                firstName: 'Mary',
                lastName: 'Manager',
                displayName: 'Mary Manager',
                role: 'Project manager',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (3)')).toBeInTheDocument();
        expect(screen.getByText('Jane Lead')).toBeInTheDocument();
        expect(screen.getByText('Bob CoLead')).toBeInTheDocument();
        expect(screen.getByText('Mary Manager')).toBeInTheDocument();
      });

      it('puts leaders with inactiveSinceDate in the Past Leaders tab', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project lead',
                inactiveSinceDate: '2024-01-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Leaders (1)')).toBeInTheDocument();
        expect(screen.queryByText('Jane Lead')).toBeNull();

        fireEvent.click(screen.getByText('Past Leaders (1)'));
        expect(screen.getByText('Jane Lead')).toBeVisible();
      });

      it('puts leaders with alumniSinceDate in the Past Leaders tab', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project co-lead',
                alumniSinceDate: '2023-06-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Leaders (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Leaders (1)')).toBeInTheDocument();
      });
    });

    describe('project members section', () => {
      it('displays Contributor and Investigator roles in the Members section', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Contributor',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Members (1)')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Contributor')).toBeInTheDocument();
      });

      it('puts members with inactiveSinceDate in the Past Members tab', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Investigator',
                inactiveSinceDate: '2024-03-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('Active Members (0)')).toBeInTheDocument();
        expect(screen.getByText('Past Members (1)')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).toBeNull();

        fireEvent.click(screen.getByText('Past Members (1)'));
        expect(screen.getByText('John Doe')).toBeVisible();
      });

      it('shows View More / View Less for members when count exceeds 8', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={Array.from({ length: 10 }, (_, i) => ({
              userId: `uuid-${i}`,
              firstName: `First${i}`,
              lastName: `Last${i}`,
              displayName: `User ${i}`,
              role: 'Contributor' as const,
            }))}
          />,
        );
        fireEvent.click(screen.getByText('View More Members'));
        expect(screen.getByText('View Less Members')).toBeVisible();
      });
    });

    it('does not show leaders in the Members section', () => {
      render(
        <ProjectOverview
          {...defaultProps}
          members={[
            {
              userId: 'uuid-lead',
              firstName: 'Jane',
              lastName: 'Lead',
              displayName: 'Jane Lead',
              role: 'Project lead',
            },
          ]}
        />,
      );
      expect(screen.getByText('Active Leaders (1)')).toBeInTheDocument();
      expect(screen.getByText('Active Members (0)')).toBeInTheDocument();
    });

    it('treats all members as past when the project status is Completed and focuses the Past tabs', () => {
      render(
        <ProjectOverview
          {...defaultProps}
          status="Completed"
          members={[
            {
              userId: 'uuid-lead',
              firstName: 'Jane',
              lastName: 'Lead',
              displayName: 'Jane Lead',
              role: 'Project lead',
            },
            {
              userId: 'uuid-member',
              firstName: 'John',
              lastName: 'Doe',
              displayName: 'John Doe',
              role: 'Contributor',
            },
          ]}
        />,
      );
      expect(screen.getByText('Active Leaders (0)')).toBeInTheDocument();
      expect(screen.getByText('Past Leaders (1)')).toBeInTheDocument();
      expect(screen.getByText('Active Members (0)')).toBeInTheDocument();
      expect(screen.getByText('Past Members (1)')).toBeInTheDocument();
      expect(screen.getByText('Jane Lead')).toBeVisible();
      expect(screen.getByText('John Doe')).toBeVisible();
    });

    describe('when STAGING_MODE flag is disabled', () => {
      beforeEach(() => {
        mockIsEnabled.mockReturnValue(false);
      });

      it('renders a flat member list with count in the title', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project lead',
              },
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Member',
                displayName: 'John Member',
                role: 'Contributor',
              },
            ]}
          />,
        );
        expect(screen.getByText('Project Members (2)')).toBeInTheDocument();
      });

      it('renders the member list with count of 0 even if there are no members', () => {
        render(<ProjectOverview {...defaultProps} members={[]} />);
        expect(screen.getByText('Project Members (0)')).toBeInTheDocument();
      });

      it('renders all members in a single list without leader or member tabs', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project lead',
              },
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Contributor',
              },
            ]}
          />,
        );
        expect(screen.getByText('Jane Lead')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText(/Active Leaders/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Past Leaders/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Active Members/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Past Members/)).not.toBeInTheDocument();
      });

      it('does not split inactive members into a past tab', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            members={[
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Contributor',
                inactiveSinceDate: '2024-03-01',
              },
            ]}
          />,
        );
        expect(screen.getByText('John Doe')).toBeVisible();
        expect(screen.queryByText(/Past Members/)).not.toBeInTheDocument();
      });

      it('shows all members in a flat list when the project status is Completed', () => {
        render(
          <ProjectOverview
            {...defaultProps}
            status="Completed"
            members={[
              {
                userId: 'uuid-lead',
                firstName: 'Jane',
                lastName: 'Lead',
                displayName: 'Jane Lead',
                role: 'Project lead',
              },
              {
                userId: 'uuid-member',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'John Doe',
                role: 'Contributor',
              },
            ]}
          />,
        );
        expect(screen.getByText('Project Members (2)')).toBeInTheDocument();
        expect(screen.getByText('Jane Lead')).toBeVisible();
        expect(screen.getByText('John Doe')).toBeVisible();
        expect(screen.queryByText(/Active Leaders/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Past Members/)).not.toBeInTheDocument();
      });
    });
  });

  it('renders the events', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        calendar={{ id: '42', name: 'test' }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Events' })).toBeVisible();
  });
  it('does not render the events card if status is completed', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        status="Completed"
        calendar={{ id: '42', name: 'test' }}
      />,
    );

    expect(
      screen.queryByRole('heading', { name: 'Events' }),
    ).not.toBeInTheDocument();
  });
  it('does not render the events if there is no calendar', () => {
    render(<ProjectOverview {...defaultProps} calendar={undefined} />);

    expect(
      screen.queryByRole('heading', { name: 'Events' }),
    ).not.toBeInTheDocument();
  });
});
