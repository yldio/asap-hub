import { render, screen } from '@testing-library/react';
import { ProjectDetail, ProjectType } from '@asap-hub/model';
import ProjectDetailHeader, { getTeamIcon } from '../ProjectDetailHeader';

const baseProject = {
  id: 'project-1',
  title: 'Test Project',
  status: 'Active' as const,
  startDate: '2023-01-01',
  endDate: '2025-12-31',
  duration: '3 yrs',
  tags: ['Tag1'],
  description: 'Test description',
  originalGrant: {
    title: 'Grant Title',
    description: 'Grant description',
  },
};

describe('getTeamIcon', () => {
  it('returns DiscoveryTeamIcon for Discovery projects', () => {
    const discoveryProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Discovery',
      researchTheme: 'Genetics',
      teamName: 'Test Team',
      fundedTeam: {
        id: 'team-1',
        name: 'Test Team',
        type: 'Discovery Team',
        description: 'Team description',
      },
    };

    const { container } = render(<>{getTeamIcon(discoveryProject)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('title')?.textContent).toBe(
      'Discovery Team Icon',
    );
  });

  it('returns ResourceTeamIcon for Resource projects that are team-based', () => {
    const resourceTeamProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Resource',
      resourceType: 'Biobank',
      isTeamBased: true,
      fundedTeam: {
        id: 'team-1',
        name: 'Test Team',
        type: 'Resource Team',
        description: 'Team description',
      },
    };

    const { container } = render(<>{getTeamIcon(resourceTeamProject)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('title')?.textContent).toBe(
      'Resource Team Icon',
    );
  });

  it('returns ResourceMemberIcon for Resource projects that are not team-based', () => {
    const resourceMemberProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Resource',
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

    const { container } = render(<>{getTeamIcon(resourceMemberProject)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('title')?.textContent).toBe(
      'Resource Member Icon',
    );
  });

  it('returns TrainerIcon for Trainee projects', () => {
    const traineeProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Trainee',
      trainer: {
        id: 'trainer-1',
        displayName: 'Dr. Trainer',
        firstName: 'Trainer',
        lastName: 'Name',
        href: '/users/trainer-1',
      },
      members: [
        {
          id: 'trainee-1',
          displayName: 'Trainee Name',
          firstName: 'Trainee',
          lastName: 'Name',
          href: '/users/trainee-1',
        },
      ],
    };

    const { container } = render(<>{getTeamIcon(traineeProject)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('returns null for unknown project type', () => {
    const unknownProject = {
      ...baseProject,
      projectType: 'Unknown' as unknown as ProjectType,
    };

    const result = getTeamIcon(unknownProject as ProjectDetail);
    expect(result).toBeNull();
  });
});

describe('ProjectDetailHeader', () => {
  const mockDiscoveryProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Discovery',
    researchTheme: 'Genetics',
    teamName: 'Martinez Lab',
    teamId: 'team-1',
    fundedTeam: {
      id: 'team-1',
      name: 'Martinez Lab',
      type: 'Discovery Team',
      description: 'Team description',
    },
  };

  const mockResourceTeamProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Resource',
    resourceType: 'Biobank',
    isTeamBased: true,
    teamName: 'Resource Team',
    teamId: 'team-2',
    googleDriveLink: 'https://drive.google.com/example',
    fundedTeam: {
      id: 'team-2',
      name: 'Resource Team',
      type: 'Resource Team',
      description: 'Team description',
    },
  };

  const mockResourceMemberProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Resource',
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

  const mockTraineeProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Trainee',
    trainer: {
      id: 'trainer-1',
      displayName: 'Dr. Sarah Mentor',
      firstName: 'Sarah',
      lastName: 'Mentor',
      href: '/users/trainer-1',
    },
    members: [
      {
        id: 'trainee-1',
        displayName: 'Emily Trainee',
        firstName: 'Emily',
        lastName: 'Trainee',
        href: '/users/trainee-1',
      },
    ],
  };

  describe('Common elements', () => {
    it('renders the project title', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders status pill', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders About tab', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/projects/discovery/1/about');
    });

    it('renders Contact button when point of contact email is provided', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          pointOfContactEmail="contact@example.com"
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('does not render Contact button when no email is provided', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    });
  });

  describe('Discovery projects', () => {
    it('renders Discovery Project type label', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Discovery Project')).toBeInTheDocument();
    });

    it('renders research theme pill', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Genetics')).toBeInTheDocument();
    });

    it('renders team name as a link when teamId is provided', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      const teamLink = screen.getByText('Martinez Lab').closest('a');
      expect(teamLink).toHaveAttribute('href', '/teams/team-1');
    });

    it('renders team name without link when teamId is not provided', () => {
      const projectWithoutTeamId = {
        ...mockDiscoveryProject,
        teamId: undefined,
      };
      render(
        <ProjectDetailHeader
          {...projectWithoutTeamId}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Martinez Lab')).toBeInTheDocument();
      const teamText = screen.getByText('Martinez Lab').closest('a');
      expect(teamText).toBeNull();
    });

    it('renders Share an Output dropdown button', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Share an Output')).toBeInTheDocument();
    });
  });

  describe('Resource projects (team-based)', () => {
    it('renders Resource Project type label', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText('Resource Project')).toBeInTheDocument();
    });

    it('renders resource type pill', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText('Biobank')).toBeInTheDocument();
    });

    it('renders Access Drive button when googleDriveLink is provided', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      const driveLink = screen.getByText('Access Drive').closest('a');
      expect(driveLink).toHaveAttribute(
        'href',
        'https://drive.google.com/example',
      );
    });

    it('does not render Share an Output button', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.queryByText('Share an Output')).not.toBeInTheDocument();
    });

    it('renders team name for team-based resource projects', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText('Resource Team')).toBeInTheDocument();
    });

    it('renders team name as link when teamId is provided', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceTeamProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      const teamLink = screen.getByText('Resource Team').closest('a');
      expect(teamLink).toHaveAttribute('href', '/teams/team-2');
    });

    it('renders team name without link when teamId is not provided', () => {
      const projectWithoutTeamId = {
        ...mockResourceTeamProject,
        teamId: undefined,
      };
      render(
        <ProjectDetailHeader
          {...projectWithoutTeamId}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText('Resource Team')).toBeInTheDocument();
      const teamText = screen.getByText('Resource Team').closest('a');
      expect(teamText).toBeNull();
    });
  });

  describe('Resource projects (not team-based)', () => {
    it('renders member list instead of team name', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceMemberProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('does not render Access Drive button when no googleDriveLink', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceMemberProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.queryByText('Access Drive')).not.toBeInTheDocument();
    });
  });

  describe('Trainee projects', () => {
    it('renders Trainee Project type label', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Trainee Project')).toBeInTheDocument();
    });

    it('renders trainer information', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Dr. Sarah Mentor')).toBeInTheDocument();
    });

    it('renders trainee members', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Emily Trainee')).toBeInTheDocument();
    });

    it('does not render Share an Output button', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.queryByText('Share an Output')).not.toBeInTheDocument();
    });
  });

  describe('Duration display', () => {
    it('renders duration for Discovery projects inline with team', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      // Check that dates are rendered
      expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Dec 2025/)).toBeInTheDocument();
    });

    it('renders duration for Trainee projects separately', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Dec 2025/)).toBeInTheDocument();
    });

    it('renders duration for Resource not team-based projects', () => {
      render(
        <ProjectDetailHeader
          {...mockResourceMemberProject}
          aboutHref="/projects/resource/1/about"
        />,
      );
      expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Dec 2025/)).toBeInTheDocument();
    });
  });
});
