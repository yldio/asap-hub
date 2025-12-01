import { render, screen } from '@testing-library/react';
import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailAbout from '../ProjectDetailAbout';

const baseProject = {
  id: 'project-1',
  title: 'Test Project',
  status: 'Active' as const,
  startDate: '2023-01-01',
  endDate: '2025-12-31',
  duration: '3 yrs',
  tags: ['Machine Learning', 'Neuroscience', 'Genetics'],
  description: 'This is a detailed project description.',
  originalGrant: 'Original Grant Title',
  originalGrantProposalId: 'proposal-1',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
    grantDescription: 'Supplement grant description with additional funding.',
    grantProposalId: 'proposal-2',
    grantStartDate: '2023-01-01',
    grantEndDate: '2025-12-31',
  },
  milestones: [
    {
      id: 'm1',
      title: 'Milestone 1',
      description: 'Complete initial research phase',
      status: 'Complete' as const,
    },
    {
      id: 'm2',
      title: 'Milestone 2',
      description: 'Analyze data and prepare interim report',
      status: 'In Progress' as const,
    },
  ],
};

describe('ProjectDetailAbout', () => {
  describe('Overview Section', () => {
    it('always renders the overview section', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...discoveryProject} />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  describe('Tags Section', () => {
    it('renders tags when tags array has items', () => {
      const projectWithTags: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics Theme',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics Theme',
        },
      };

      render(<ProjectDetailAbout {...projectWithTags} />);
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Neuroscience')).toBeInTheDocument();
      expect(screen.getByText('Genetics')).toBeInTheDocument();
    });

    it('does not render tags section when tags array is empty', () => {
      const projectWithoutTags: ProjectDetail = {
        ...baseProject,
        tags: [],
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      const { container } = render(
        <ProjectDetailAbout {...projectWithoutTags} />,
      );
      // Tags should not be in the document when empty
      expect(container).not.toHaveTextContent('Machine Learning');
    });
  });

  describe('Milestones Section', () => {
    it('renders milestones when milestones array has items', () => {
      const projectWithMilestones: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...projectWithMilestones} />);
      expect(screen.getByText('Milestones')).toBeInTheDocument();
    });

    it('does not render milestones section when milestones array is empty', () => {
      const projectWithoutMilestones: ProjectDetail = {
        ...baseProject,
        milestones: [],
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...projectWithoutMilestones} />);
      expect(screen.queryByText('Milestones')).not.toBeInTheDocument();
    });

    it('does not render milestones section when milestones is undefined', () => {
      const projectWithoutMilestones: ProjectDetail = {
        ...baseProject,
        milestones: undefined,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...projectWithoutMilestones} />);
      expect(screen.queryByText('Milestones')).not.toBeInTheDocument();
    });
  });

  describe('Contributors Section - Discovery Projects', () => {
    it('renders Contributors for Discovery projects', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...discoveryProject} />);
      expect(screen.getByText('Contributors')).toBeInTheDocument();
    });
  });

  describe('Contributors Section - Resource Projects (Team-Based)', () => {
    it('renders Contributors for Resource team-based projects', () => {
      const resourceTeamProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Biobank',
        isTeamBased: true,
        fundedTeam: {
          id: 'team-1',
          displayName: 'Resource Team',
          teamType: 'Resource Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...resourceTeamProject} />);
      expect(screen.getByText('Contributors')).toBeInTheDocument();
    });

    it('does not render Contributors when fundedTeam is not provided', () => {
      const resourceTeamProjectNoTeam: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Biobank',
        isTeamBased: true,
        fundedTeam: undefined,
      };

      render(<ProjectDetailAbout {...resourceTeamProjectNoTeam} />);
      expect(screen.queryByText('Contributors')).not.toBeInTheDocument();
    });
  });

  describe('Contributors Section - Resource Projects (Not Team-Based)', () => {
    it('renders Contributors for Resource not team-based projects with members', () => {
      const resourceMemberProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Software Tool',
        isTeamBased: false,
        members: [
          {
            id: 'user-1',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            href: '/users/john-doe',
          },
        ],
      };

      render(<ProjectDetailAbout {...resourceMemberProject} />);
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('does not render Contributors when members is not provided', () => {
      const resourceMemberProjectNoMembers: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Software Tool',
        isTeamBased: false,
        members: undefined,
      };

      render(<ProjectDetailAbout {...resourceMemberProjectNoMembers} />);
      expect(screen.queryByText('Contributors')).not.toBeInTheDocument();
    });
  });

  describe('Contributors Section - Trainee Projects', () => {
    it('renders Contributors for Trainee projects', () => {
      const traineeProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Trainee Project',
        members: [
          {
            id: 'trainee-1',
            displayName: 'Emily Trainee',
            firstName: 'Emily',
            lastName: 'Trainee',
            href: '/users/trainee-1',
            role: 'Trainee',
          },
          {
            id: 'trainer-1',
            displayName: 'Dr. Sarah Mentor',
            firstName: 'Sarah',
            lastName: 'Mentor',
            href: '/users/trainer-1',
            role: 'Trainee Project - Mentor',
          },
        ],
      };

      render(<ProjectDetailAbout {...traineeProject} />);
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Mentor')).toBeInTheDocument();
      expect(screen.getByText('Emily Trainee')).toBeInTheDocument();
    });
  });

  describe('Contact CTA Card', () => {
    it('renders Contact CTA when point of contact email is provided', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(
        <ProjectDetailAbout
          {...discoveryProject}
          pointOfContactEmail="contact@example.com"
        />,
      );
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
      expect(screen.getByText(/Members are here to help/)).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('does not render Contact CTA when no email is provided or status is not Active', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      const { rerender } = render(
        <ProjectDetailAbout
          {...discoveryProject}
          pointOfContactEmail={undefined}
        />,
      );
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
      rerender(<ProjectDetailAbout {...discoveryProject} status="Closed" />);
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
    });

    it('renders Contact CTA with mailto link', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(
        <ProjectDetailAbout
          {...discoveryProject}
          pointOfContactEmail="test@example.com"
        />,
      );
      const contactButton = screen.getByText('Contact').closest('a');
      expect(contactButton).toHaveAttribute('href', 'mailto:test@example.com');
    });
  });

  describe('Complete rendering for all project types', () => {
    it('renders all sections for a complete Discovery project', () => {
      const completeDiscoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(
        <ProjectDetailAbout
          {...completeDiscoveryProject}
          pointOfContactEmail="contact@example.com"
        />,
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });

    it('renders all sections for a complete Resource team-based project', () => {
      const completeResourceProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Biobank',
        isTeamBased: true,
        fundedTeam: {
          id: 'team-1',
          displayName: 'Resource Team',
          teamType: 'Resource Team',
          researchTheme: 'Genetics',
        },
      };

      render(
        <ProjectDetailAbout
          {...completeResourceProject}
          pointOfContactEmail="contact@example.com"
        />,
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });

    it('renders all sections for a complete Resource not team-based project', () => {
      const completeResourceMemberProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Software Tool',
        isTeamBased: false,
        members: [
          {
            id: 'user-1',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            href: '/users/john-doe',
            role: 'Lead Developer',
          },
          {
            id: 'user-2',
            displayName: 'Jane Smith',
            firstName: 'Jane',
            lastName: 'Smith',
            href: '/users/jane-smith',
            role: 'Data Scientist',
          },
        ],
      };

      render(
        <ProjectDetailAbout
          {...completeResourceMemberProject}
          pointOfContactEmail="contact@example.com"
        />,
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });

    it('renders all sections for a complete Trainee project', () => {
      const completeTraineeProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Trainee Project',
        members: [
          {
            id: 'trainee-1',
            displayName: 'Emily Trainee',
            firstName: 'Emily',
            lastName: 'Trainee',
            href: '/users/trainee-1',
            role: 'Trainee',
          },
          {
            id: 'trainee-2',
            displayName: 'Michael Student',
            firstName: 'Michael',
            lastName: 'Student',
            href: '/users/trainee-2',
            role: 'Trainee',
          },
          {
            id: 'trainer-1',
            displayName: 'Dr. Sarah Mentor',
            firstName: 'Sarah',
            lastName: 'Mentor',
            href: '/users/trainer-1',
            role: 'Trainee Project - Mentor',
          },
        ],
      };

      render(
        <ProjectDetailAbout
          {...completeTraineeProject}
          pointOfContactEmail="contact@example.com"
        />,
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Mentor')).toBeInTheDocument();
      expect(screen.getByText('Emily Trainee')).toBeInTheDocument();
      expect(screen.getByText('Michael Student')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });
  });

  describe('Minimal project rendering', () => {
    it('renders only Overview when no optional sections are provided', () => {
      const minimalProject: ProjectDetail = {
        ...baseProject,
        tags: [],
        milestones: undefined,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(<ProjectDetailAbout {...minimalProject} />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
      expect(screen.queryByText('Milestones')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Have additional questions?'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Sections rendering', () => {
    it('renders all sections', () => {
      const discoveryProject: ProjectDetail = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'Genetics',
        teamName: 'Alpha Team',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Alpha Team',
          teamType: 'Discovery Team',
          researchTheme: 'Genetics',
        },
      };

      render(
        <ProjectDetailAbout
          {...discoveryProject}
          pointOfContactEmail="contact@example.com"
        />,
      );

      // Verify all expected sections are present
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Contributors')).toBeInTheDocument();
      expect(
        screen.getByText('Have additional questions?'),
      ).toBeInTheDocument();
    });
  });
});
