import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProjectDetail, ProjectType } from '@asap-hub/model';
import ProjectDetailHeader, { getTeamIcon } from '../ProjectDetailHeader';

const baseProject = {
  id: 'project-1',
  title: 'Test Project',
  status: 'Active' as const,
  statusRank: 1,
  startDate: '2023-01-01',
  endDate: '2025-12-31',
  duration: '3 yrs',
  tags: ['Tag1'],
  description: 'Test description',
  originalGrant: 'Grant Title',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
    grantDescription: 'Supplement grant description',
    grantProposalId: 'proposal-1',
    grantStartDate: '2023-01-01',
    grantEndDate: '2025-12-31',
  },
};

describe('getTeamIcon', () => {
  it('returns DiscoveryTeamIcon for Discovery projects', () => {
    const discoveryProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Discovery Project',
      researchTheme: 'Genetics',
      teamName: 'Test Team',
      fundedTeam: {
        id: 'team-1',
        displayName: 'Test Team',
        teamType: 'Discovery Team',
        researchTheme: 'Genetics',
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
      projectType: 'Resource Project',
      resourceType: 'Biobank',
      isTeamBased: true,
      fundedTeam: {
        id: 'team-1',
        displayName: 'Test Team',
        teamType: 'Resource Team',
        researchTheme: 'Genetics',
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

    const { container } = render(<>{getTeamIcon(resourceMemberProject)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('title')?.textContent).toBe(
      'Resource Member Icon',
    );
  });

  it('returns TraineeIcon for Trainee projects', () => {
    const traineeProject: ProjectDetail = {
      ...baseProject,
      projectType: 'Trainee Project',
      members: [
        {
          id: 'trainee-1',
          displayName: 'Trainee Name',
          firstName: 'Trainee',
          lastName: 'Name',
          href: '/users/trainee-1',
          role: 'Trainee Project - Lead',
        },
        {
          id: 'trainer-1',
          displayName: 'Dr. Trainer',
          firstName: 'Trainer',
          lastName: 'Name',
          href: '/users/trainer-1',
          role: 'Trainee Project - Mentor',
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

    const result = getTeamIcon(unknownProject as unknown as ProjectDetail);
    expect(result).toBeNull();
  });
});

describe('ProjectDetailHeader', () => {
  const mockDiscoveryProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Discovery Project',
    researchTheme: 'Genetics',
    teamName: 'Alpha Team',
    teamId: 'team-1',
    fundedTeam: {
      id: 'team-1',
      displayName: 'Alpha Team',
      teamType: 'Discovery Team',
      researchTheme: 'Genetics',
    },
  };

  const mockResourceTeamProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Resource Project',
    resourceType: 'Biobank',
    isTeamBased: true,
    teamName: 'Resource Team',
    teamId: 'team-2',
    googleDriveLink: 'https://drive.google.com/example',
    fundedTeam: {
      id: 'team-2',
      displayName: 'Resource Team',
      teamType: 'Resource Team',
      researchTheme: 'Genetics',
    },
  };

  const mockResourceMemberProject: ProjectDetail = {
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

  const mockTraineeProject: ProjectDetail = {
    ...baseProject,
    projectType: 'Trainee Project',
    members: [
      {
        id: 'trainee-1',
        displayName: 'Emily Trainee',
        firstName: 'Emily',
        lastName: 'Trainee',
        href: '/users/trainee-1',
        role: 'Trainee Project - Lead',
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

    it('renders or hides Contact button when point of contact email is provided and project status is Active or not', () => {
      const { rerender } = render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          pointOfContactEmail="contact@example.com"
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.getByText('Contact')).toBeInTheDocument();
      rerender(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          status="Closed"
          pointOfContactEmail="contact@example.com"
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
      rerender(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          status="Active"
          pointOfContactEmail={undefined}
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(screen.queryByText('Contact')).not.toBeInTheDocument();
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

    it('renders copy email button when point of contact email is provided', async () => {
      // Mock clipboard API
      const writeTextMock = jest.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          pointOfContactEmail="test@example.com"
          aboutHref="/projects/discovery/1/about"
        />,
      );

      // Find copy button by its tooltip text
      const copyButton = screen.getByText('Copy Email').closest('button');
      expect(copyButton).toBeInTheDocument();

      // Click the button to trigger clipboard write
      if (copyButton) {
        fireEvent.click(copyButton);
      }

      // Wait for state updates to complete
      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('renders Closed Project banner when status is Closed', () => {
      render(
        <ProjectDetailHeader
          {...mockDiscoveryProject}
          status="Closed"
          aboutHref="/projects/discovery/1/about"
        />,
      );
      expect(
        screen.getByText(
          'This project concluded earlier than expected and some milestones are incomplete.',
        ),
      ).toBeInTheDocument();
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
      const teamLink = screen.getByText('Alpha Team').closest('a');
      expect(teamLink).toHaveAttribute('href', '/network/teams/team-1');
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
      expect(screen.getByText('Alpha Team')).toBeInTheDocument();
      const teamText = screen.getByText('Alpha Team').closest('a');
      expect(teamText).toBeNull();
    });

    /* eslint-disable jest/no-commented-out-tests */
    // TODO: Add test for Share an Output dropdown button when it is implemented
    // it('renders Share an Output dropdown button', () => {
    //   render(
    //     <ProjectDetailHeader
    //       {...mockDiscoveryProject}
    //       aboutHref="/projects/discovery/1/about"
    //     />,
    //   );
    //   expect(screen.getByText('Share an Output')).toBeInTheDocument();
    // });
    /* eslint-enable jest/no-commented-out-tests */
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

    /* eslint-disable jest/no-commented-out-tests */
    // TODO: Add test for Share an Output dropdown button when it is implemented
    // it('does not render Share an Output button', () => {
    //   render(
    //     <ProjectDetailHeader
    //       {...mockResourceTeamProject}
    //       aboutHref="/projects/resource/1/about"
    //     />,
    //   );
    //   expect(screen.queryByText('Share an Output')).not.toBeInTheDocument();
    // });
    /* eslint-enable jest/no-commented-out-tests */

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
      expect(teamLink).toHaveAttribute('href', '/network/teams/team-2');
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

    it('renders trainees in the first row', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Emily Trainee')).toBeInTheDocument();
    });

    it('renders trainers in the second row', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Dr. Sarah Mentor')).toBeInTheDocument();
    });

    it('renders multiple mentors correctly', () => {
      const projectWithMultipleMentors = {
        ...mockTraineeProject,
        members: [
          ...mockTraineeProject.members,
          {
            id: 'mentor-2',
            displayName: 'Dr. John Mentor',
            firstName: 'John',
            lastName: 'Mentor',
            href: '/users/mentor-2',
            role: 'Trainee Project - Mentor',
          },
          {
            id: 'mentor-3',
            displayName: 'Dr. Jane Key',
            firstName: 'Jane',
            lastName: 'Key',
            href: '/users/mentor-3',
            role: 'Trainee Project - Key Personnel',
          },
        ],
      };
      render(
        <ProjectDetailHeader
          {...projectWithMultipleMentors}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText('Dr. Sarah Mentor')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Mentor')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jane Key')).toBeInTheDocument();
    });

    /* eslint-disable jest/no-commented-out-tests */
    // TODO: Add test for Share an Output dropdown button when it is implemented
    // it('does not render Share an Output button', () => {
    //   render(
    //     <ProjectDetailHeader
    //       {...mockTraineeProject}
    //       aboutHref="/projects/trainee/1/about"
    //     />,
    //   );
    //   expect(screen.queryByText('Share an Output')).not.toBeInTheDocument();
    // });
    /* eslint-enable jest/no-commented-out-tests */
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
      expect(screen.getByText(/Present/)).toBeInTheDocument();
    });

    it('renders duration for Trainee projects separately', () => {
      render(
        <ProjectDetailHeader
          {...mockTraineeProject}
          aboutHref="/projects/trainee/1/about"
        />,
      );
      expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Present/)).toBeInTheDocument();
    });

    it('renders duration for Resource not team-based projects', () => {
      const { getByText } = render(
        <ProjectDetailHeader
          {...mockResourceMemberProject}
          aboutHref="/projects/resource/1/about"
        />,
      );

      expect(getByText(/Jan 2023/)).toBeInTheDocument();
      expect(getByText(/Present/)).toBeInTheDocument();
    });
  });
});
