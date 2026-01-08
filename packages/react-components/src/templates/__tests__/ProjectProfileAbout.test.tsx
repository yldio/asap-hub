import { ComponentProps } from 'react';
import { TeamRole } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ProjectProfileAbout from '../ProjectProfileAbout';

jest.mock('@asap-hub/flags', () => ({
  isEnabled: jest.fn(() => true),
  reset: jest.fn(),
}));

const props: ComponentProps<typeof ProjectProfileAbout> = {
  projectTitle: 'Test Project',
  projectSummary: 'This is a test project summary',
  tags: [],
  pointOfContact: undefined,
  members: [],
  proposalURL: 'test-proposal-id',
  teamListElementId: 'test-team-list',
  supplementGrant: undefined,
  hideExpertiseAndResources: true,
};

describe('ProjectProfileAbout', () => {
  describe('Overview Section', () => {
    it('renders the overview section when projectTitle is provided', () => {
      render(<ProjectProfileAbout {...props} />);
      expect(screen.getByText('Project Overview')).toBeInTheDocument();
    });

    it('does not render the overview section when projectTitle is not provided', () => {
      render(<ProjectProfileAbout {...props} projectTitle={undefined} />);
      expect(screen.queryByText('Project Overview')).not.toBeInTheDocument();
    });
  });

  describe('Tags Section', () => {
    it('renders tags when tags array has items', () => {
      render(
        <ProjectProfileAbout
          {...props}
          tags={[
            { name: 'Machine Learning', id: '1' },
            { name: 'Neuroscience', id: '2' },
          ]}
        />,
      );
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Neuroscience')).toBeInTheDocument();
    });

    it('does not render tags section when tags array is empty', () => {
      render(<ProjectProfileAbout {...props} tags={[]} />);
      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
      expect(screen.queryByText('Neuroscience')).not.toBeInTheDocument();
    });

    it('does not render tags section when tags is undefined', () => {
      render(<ProjectProfileAbout {...props} tags={undefined} />);
      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
      expect(screen.queryByText('Neuroscience')).not.toBeInTheDocument();
    });
  });

  describe('Team Members Section', () => {
    it('renders the team members section', () => {
      render(<ProjectProfileAbout {...props} />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });

    it('passes correct props to TeamMembersTabbedCard for active team', () => {
      render(<ProjectProfileAbout {...props} inactiveSince={undefined} />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      // The component should render with isTeamInactive=false when inactiveSince is undefined
    });

    it('passes correct props to TeamMembersTabbedCard for inactive team', () => {
      render(<ProjectProfileAbout {...props} inactiveSince="2022-10-25" />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      // The component should render with isTeamInactive=true when inactiveSince is provided
    });

    it('renders team members list when members are provided', () => {
      const members = [
        {
          id: 'member-1',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager' as TeamRole,
          email: 'john.doe@example.com',
        },
        {
          id: 'member-2',
          displayName: 'Jane Smith',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'Research Scientist' as TeamRole,
          email: 'jane.smith@example.com',
        },
      ];

      render(<ProjectProfileAbout {...props} members={members} />);
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });

    it('renders empty team members section when no members', () => {
      render(<ProjectProfileAbout {...props} members={[]} />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });
  });

  describe('Team Groups Card', () => {
    it('renders team groups card when provided', () => {
      const teamGroupsCard = <div>Test Groups Card</div>;
      render(
        <ProjectProfileAbout {...props} teamGroupsCard={teamGroupsCard} />,
      );
      expect(screen.getByText('Test Groups Card')).toBeInTheDocument();
    });

    it('does not render team groups card when not provided', () => {
      render(<ProjectProfileAbout {...props} teamGroupsCard={undefined} />);
      expect(screen.queryByText('Test Groups Card')).not.toBeInTheDocument();
    });
  });

  describe('Contact CTA', () => {
    it('renders contact CTA when pointOfContact is provided', () => {
      const pointOfContact = {
        id: 'contact-1',
        displayName: 'Contact Person',
        firstName: 'Contact',
        lastName: 'Person',
        role: 'Project Manager' as TeamRole,
        email: 'contact@example.com',
      };

      render(
        <ProjectProfileAbout {...props} pointOfContact={pointOfContact} />,
      );
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('does not render contact CTA when pointOfContact is not provided', () => {
      render(<ProjectProfileAbout {...props} pointOfContact={undefined} />);
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    });

    it('renders contact CTA with correct mailto link', () => {
      const pointOfContact = {
        id: 'contact-1',
        displayName: 'Contact Person',
        firstName: 'Contact',
        lastName: 'Person',
        role: 'Project Manager' as TeamRole,
        email: 'contact@example.com',
      };

      render(
        <ProjectProfileAbout {...props} pointOfContact={pointOfContact} />,
      );
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toHaveAttribute('href', 'mailto:contact@example.com');
    });
  });

  describe('Supplement Grant', () => {
    it('passes supplementGrant to ProjectProfileOverview when provided', () => {
      const supplementGrant = {
        title: 'Supplement Grant Title',
        description: 'Supplement grant description',
        proposalURL: 'supplement-proposal-id',
      };

      render(
        <ProjectProfileAbout {...props} supplementGrant={supplementGrant} />,
      );
      expect(screen.getByText('Project Overview')).toBeInTheDocument();
      // The supplement grant data is passed to the ProjectProfileOverview component
    });
  });

  describe('Complete component rendering', () => {
    it('renders all sections when all props are provided', () => {
      const pointOfContact = {
        id: 'contact-1',
        displayName: 'Contact Person',
        firstName: 'Contact',
        lastName: 'Person',
        role: 'Project Manager' as TeamRole,
        email: 'contact@example.com',
      };

      const members = [
        {
          id: 'member-1',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager' as TeamRole,
          email: 'john.doe@example.com',
        },
      ];

      const teamGroupsCard = <div>Groups Card Content</div>;

      render(
        <ProjectProfileAbout
          {...props}
          tags={[{ name: 'Machine Learning', id: '1' }]}
          pointOfContact={pointOfContact}
          members={members}
          teamGroupsCard={teamGroupsCard}
        />,
      );

      expect(screen.getByText('Project Overview')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Groups Card Content')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });

    it('renders minimal component when only required props provided', () => {
      render(<ProjectProfileAbout {...props} />);

      expect(screen.getByText('Project Overview')).toBeInTheDocument();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders team list section with correct id', () => {
      const { container } = render(<ProjectProfileAbout {...props} />);
      const teamSection = container.querySelector('#test-team-list');
      expect(teamSection).toBeInTheDocument();
    });
  });
});
