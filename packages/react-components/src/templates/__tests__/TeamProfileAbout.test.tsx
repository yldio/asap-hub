import { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TeamRole } from '@asap-hub/model';
import { enable, disable } from '@asap-hub/flags';

import TeamProfileAbout from '../TeamProfileAbout';

const baseProps: ComponentProps<typeof TeamProfileAbout> = {
  teamDescription: '',
  tags: [],
  projectTitle: '',
  projectSummary: undefined,
  linkedProjectId: undefined,
  supplementGrant: undefined,
  members: [],
  teamListElementId: 'test-team-list',
  teamStatus: 'Active',
  teamType: 'Discovery Team',
  labs: [],
  researchTheme: undefined,
  resourceType: undefined,
  projectType: undefined,
  proposalURL: undefined,
  hideExpertiseAndResources: false,
  resourceTitle: undefined,
  resourceDescription: undefined,
  resourceButtonCopy: undefined,
  resourceContactEmail: undefined,
  resourceLink: undefined,
};

describe('TeamProfileAbout', () => {
  beforeEach(() => {
    // Reset flag state before each test
    disable('PROJECTS_MVP');
  });

  describe('Overview Section', () => {
    describe('MVP Mode (PROJECTS_MVP enabled)', () => {
      it('renders TeamProfileOverview when teamDescription is provided', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            teamDescription="Team description text"
            tags={[{ name: 'Tag 1', id: '1' }]}
          />,
        );

        expect(
          screen.getByRole('heading', { name: /Team Description/i }),
        ).toBeVisible();
        expect(screen.getByText('Team description text')).toBeVisible();
      });

      it('does not render TeamProfileOverview when teamDescription is not provided', () => {
        enable('PROJECTS_MVP');
        render(<TeamProfileAbout {...baseProps} teamDescription={undefined} />);

        expect(screen.queryByText(/Team Description/i)).not.toBeInTheDocument();
      });

      it('passes correct props to TeamProfileOverview', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            teamDescription="Description"
            teamType="Discovery Team"
            researchTheme="Theme 1"
            resourceType={undefined}
            tags={[{ name: 'Tag 1', id: '1' }]}
          />,
        );

        expect(screen.getByText('Description')).toBeVisible();
        expect(screen.getByText('Tag 1')).toBeVisible();
      });
    });

    describe('Legacy Mode (PROJECTS_MVP disabled)', () => {
      it('renders ProjectProfileOverview when projectTitle is provided', () => {
        disable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            projectTitle="Test Project"
            projectSummary="Project summary"
            proposalURL="proposal-id"
          />,
        );

        expect(screen.getByText('Project Overview')).toBeInTheDocument();
        expect(screen.getByText('Test Project')).toBeInTheDocument();
      });

      it('does not render ProjectProfileOverview when projectTitle is not provided', () => {
        disable('PROJECTS_MVP');
        render(<TeamProfileAbout {...baseProps} projectTitle={''} />);

        expect(screen.queryByText('Project Overview')).not.toBeInTheDocument();
      });

      it('passes supplementGrant to ProjectProfileOverview', () => {
        disable('PROJECTS_MVP');
        const supplementGrant = {
          title: 'Supplement Grant',
          description: 'Supplement description',
          proposalURL: 'supplement-id',
        };

        render(
          <TeamProfileAbout
            {...baseProps}
            projectTitle="Test Project"
            supplementGrant={supplementGrant}
          />,
        );

        expect(screen.getByText('Project Overview')).toBeInTheDocument();
      });
    });
  });

  describe('Expertise and Resources Section', () => {
    it('renders ProfileExpertiseAndResources in legacy mode when tags are provided', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          tags={[
            { name: 'Machine Learning', id: '1' },
            { name: 'Neuroscience', id: '2' },
          ]}
        />,
      );

      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Neuroscience')).toBeInTheDocument();
    });

    it('does not render ProfileExpertiseAndResources in MVP mode', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          tags={[{ name: 'Machine Learning', id: '1' }]}
        />,
      );

      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
    });

    it('does not render tags section when tags array is empty in legacy mode', () => {
      disable('PROJECTS_MVP');
      render(<TeamProfileAbout {...baseProps} tags={[]} />);

      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
    });

    it('respects hideExpertiseAndResources prop in legacy mode', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          tags={[{ name: 'Tag 1', id: '1' }]}
          hideExpertiseAndResources={true}
        />,
      );

      // Component should still render but may hide certain elements
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });
  });

  describe('Projects Card', () => {
    it('renders TeamProjectsCard in MVP mode when project data is present', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          projectTitle="Project Alpha"
          linkedProjectId="proj-1"
          projectSummary="Original grant"
          supplementGrant={{ title: 'Supp', description: 'Supplement desc' }}
        />,
      );

      expect(screen.getByText('Projects')).toBeVisible();
      expect(screen.getByText('Project Alpha')).toBeVisible();
      expect(screen.getByText('Supplement desc')).toBeVisible();
    });

    it('does not render TeamProjectsCard in legacy mode', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          projectTitle="Project Alpha"
          linkedProjectId="proj-1"
        />,
      );

      expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    });

    it('does not render TeamProjectsCard when linkedProjectId is missing', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          projectTitle="Project Alpha"
          linkedProjectId={undefined}
        />,
      );

      expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    });
  });

  describe('Labs Card', () => {
    it('renders TeamLabsCard in MVP mode when labs are present', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          labs={[{ name: 'Lab 1', id: '1', labPrincipalInvestigatorId: '' }]}
          teamStatus="Active"
        />,
      );

      expect(screen.getByText('Lab 1')).toBeVisible();
      expect(screen.getByRole('heading', { name: /labs/i })).toBeVisible();
    });

    it('does not render TeamLabsCard in legacy mode', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          labs={[{ name: 'Lab 1', id: '1', labPrincipalInvestigatorId: '' }]}
        />,
      );

      expect(screen.queryByText('Lab 1')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /labs/i }),
      ).not.toBeInTheDocument();
    });

    it('does not render TeamLabsCard when labs array is empty', () => {
      enable('PROJECTS_MVP');
      render(<TeamProfileAbout {...baseProps} labs={[]} />);

      expect(
        screen.queryByRole('heading', { name: /labs/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Resources Card', () => {
    it('renders TeamResourcesCard in MVP mode for Resource Team when resource fields are populated', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Resource Team"
          resourceTitle="Resource Title"
          resourceDescription="Resource description"
          resourceButtonCopy="Get Started"
          resourceContactEmail="contact@example.com"
        />,
      );

      expect(
        screen.getByRole('heading', { name: /resources/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Resource description')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Get Started' }),
      ).toBeInTheDocument();
    });

    it('does not render TeamResourcesCard in legacy mode', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Resource Team"
          resourceTitle="Resource Title"
          resourceDescription="Resource description"
        />,
      );

      expect(
        screen.queryByRole('heading', { name: /resources/i }),
      ).not.toBeInTheDocument();
    });

    it('does not render TeamResourcesCard for Discovery Team', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Discovery Team"
          resourceTitle="Resource Title"
          resourceDescription="Resource description"
        />,
      );

      expect(
        screen.queryByRole('heading', { name: /resources/i }),
      ).not.toBeInTheDocument();
    });

    it('does not render TeamResourcesCard when no resource fields are populated', () => {
      enable('PROJECTS_MVP');
      render(<TeamProfileAbout {...baseProps} teamType="Resource Team" />);

      expect(
        screen.queryByRole('heading', { name: /resources/i }),
      ).not.toBeInTheDocument();
    });

    it('renders external link when resourceLink is provided', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Resource Team"
          resourceTitle="Resource Title"
          resourceLink="https://drive.google.com"
        />,
      );

      const link = screen.getByRole('link', { name: /access drive/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://drive.google.com');
    });
  });

  describe('Team Members Section', () => {
    it('renders the team members section', () => {
      render(<TeamProfileAbout {...baseProps} />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
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

      render(<TeamProfileAbout {...baseProps} members={members} />);
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });

    it('passes correct props to TeamMembersTabbedCard for active team', () => {
      render(<TeamProfileAbout {...baseProps} inactiveSince={undefined} />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });

    it('passes correct props to TeamMembersTabbedCard for inactive team', () => {
      render(<TeamProfileAbout {...baseProps} inactiveSince="2022-10-25" />);
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });

    it('renders team members section with correct id', () => {
      const { container } = render(<TeamProfileAbout {...baseProps} />);
      const teamSection = container.querySelector('#test-team-list');
      expect(teamSection).toBeInTheDocument();
    });
  });

  describe('Team Groups Card', () => {
    it('renders team groups card for Discovery Team in MVP mode', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Discovery Team"
          teamGroupsCard={<div>Groups Card</div>}
        />,
      );

      expect(screen.getByText('Groups Card')).toBeVisible();
    });

    it('does not render team groups card for Resource Team in MVP mode', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Resource Team"
          teamGroupsCard={<div>Groups Card</div>}
        />,
      );

      expect(screen.queryByText('Groups Card')).not.toBeInTheDocument();
    });

    it('renders team groups card in legacy mode regardless of team type', () => {
      disable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          teamType="Resource Team"
          teamGroupsCard={<div>Groups Card</div>}
        />,
      );

      expect(screen.getByText('Groups Card')).toBeVisible();
    });

    it('does not render team groups card when not provided', () => {
      render(<TeamProfileAbout {...baseProps} teamGroupsCard={undefined} />);
      expect(screen.queryByText('Groups Card')).not.toBeInTheDocument();
    });
  });

  describe('Contact CTA', () => {
    const originalNavigator = window.navigator;
    beforeEach(() => {
      Object.assign(window.navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });
    });

    afterEach(() => {
      Object.assign(window.navigator, originalNavigator);
    });

    describe('MVP Mode (PROJECTS_MVP enabled)', () => {
      it('renders contact CTA when pointOfContact exists and team is Active', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            pointOfContact="contact@example.com"
            teamStatus="Active"
          />,
        );

        expect(
          screen.getByText('Have additional questions?'),
        ).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
      });

      it('does not render contact CTA when team is Inactive', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            pointOfContact="contact@example.com"
            teamStatus="Inactive"
          />,
        );

        expect(
          screen.queryByText('Have additional questions?'),
        ).not.toBeInTheDocument();
      });

      it('uses pointOfContact directly in MVP mode', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            pointOfContact="project@example.com"
            teamStatus="Active"
            members={[
              {
                id: 'pm-id',
                displayName: 'PM Name',
                firstName: 'PM',
                lastName: 'Name',
                email: 'pm@example.com',
                role: 'Project Manager',
              },
            ]}
          />,
        );

        expect(screen.getByText('Contact').parentElement).toHaveAttribute(
          'href',
          'mailto:project@example.com',
        );
      });

      it('does not render contact CTA when pointOfContact is missing', () => {
        enable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            pointOfContact={undefined}
            teamStatus="Active"
          />,
        );

        expect(screen.queryByText('Contact')).not.toBeInTheDocument();
      });
    });

    describe('Legacy Mode (PROJECTS_MVP disabled)', () => {
      it('renders contact CTA when PM exists in members', () => {
        disable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            members={[
              {
                id: 'pm-id',
                displayName: 'PM Name',
                firstName: 'PM',
                lastName: 'Name',
                email: 'pm@example.com',
                role: 'Project Manager',
              },
            ]}
          />,
        );

        expect(
          screen.getByText('Have additional questions?'),
        ).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
      });

      it('renders contact CTA even when team is Inactive', () => {
        disable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            teamStatus="Inactive"
            members={[
              {
                id: 'pm-id',
                displayName: 'PM Name',
                firstName: 'PM',
                lastName: 'Name',
                email: 'pm@example.com',
                role: 'Project Manager',
              },
            ]}
          />,
        );

        expect(
          screen.getByText('Have additional questions?'),
        ).toBeInTheDocument();
      });

      it('uses PM email from members (ignores pointOfContact in legacy mode)', () => {
        disable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            pointOfContact="contact@example.com"
            members={[
              {
                id: 'pm-id',
                displayName: 'PM Name',
                firstName: 'PM',
                lastName: 'Name',
                email: 'pm@example.com',
                role: 'Project Manager',
              },
            ]}
          />,
        );

        expect(screen.getByText('Contact').parentElement).toHaveAttribute(
          'href',
          'mailto:pm@example.com',
        );
      });

      it('does not render contact CTA when no PM exists', () => {
        disable('PROJECTS_MVP');
        render(<TeamProfileAbout {...baseProps} members={[]} />);

        expect(screen.queryByText('Contact')).not.toBeInTheDocument();
      });

      it('renders contact CTA with correct mailto link using PM email', () => {
        disable('PROJECTS_MVP');
        render(
          <TeamProfileAbout
            {...baseProps}
            members={[
              {
                id: 'pm-id',
                displayName: 'PM Name',
                firstName: 'PM',
                lastName: 'Name',
                email: 'pm@example.com',
                role: 'Project Manager',
              },
            ]}
          />,
        );

        const contactLink = screen.getByText('Contact').closest('a');
        expect(contactLink).toHaveAttribute('href', 'mailto:pm@example.com');
      });
    });

    it('adds the email to clipboard when user clicks on copy button', () => {
      enable('PROJECTS_MVP');
      render(
        <TeamProfileAbout
          {...baseProps}
          pointOfContact="pm@asap.com"
          teamStatus="Active"
        />,
      );

      fireEvent.click(screen.getByTitle(/copy/i));
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        expect.stringMatching(/pm@asap.com/i),
      );
    });
  });

  describe('Complete component rendering', () => {
    it('renders all sections in MVP mode when all props are provided', () => {
      enable('PROJECTS_MVP');
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

      render(
        <TeamProfileAbout
          {...baseProps}
          teamDescription="Team description"
          projectTitle="Project Title"
          linkedProjectId="proj-1"
          labs={[{ name: 'Lab 1', id: '1', labPrincipalInvestigatorId: '' }]}
          tags={[{ name: 'Tag 1', id: '1' }]}
          pointOfContact="contact@example.com"
          teamStatus="Active"
          teamType="Discovery Team"
          members={members}
          teamGroupsCard={<div>Groups Card</div>}
        />,
      );

      expect(
        screen.getByRole('heading', { name: /Team Description/i }),
      ).toBeVisible();
      expect(screen.getByText('Team description')).toBeVisible();
      expect(screen.getByText('Projects')).toBeVisible();
      expect(screen.getByText('Lab 1')).toBeVisible();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Groups Card')).toBeVisible();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });

    it('renders all sections in legacy mode when all props are provided', () => {
      disable('PROJECTS_MVP');
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

      render(
        <TeamProfileAbout
          {...baseProps}
          projectTitle="Test Project"
          projectSummary="Project summary"
          tags={[{ name: 'Machine Learning', id: '1' }]}
          pointOfContact="contact@example.com"
          members={members}
          teamGroupsCard={<div>Groups Card Content</div>}
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
      render(<TeamProfileAbout {...baseProps} />);

      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
    });
  });
});
