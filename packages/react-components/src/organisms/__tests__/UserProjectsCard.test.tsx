import { render, screen, fireEvent } from '@testing-library/react';
import { UserProjectMembership } from '@asap-hub/model';

import UserProjectsCard from '../UserProjectsCard';

const mockProjects: UserProjectMembership[] = [
  {
    id: 'discovery-project-1',
    title: 'Understanding Genetic Mechanisms in PD',
    projectType: 'Discovery Project',
    status: 'Active',
  },
  {
    id: 'resource-project-1',
    title: 'PD Biobank Resource',
    projectType: 'Resource Project',
    status: 'Completed',
  },
  {
    id: 'trainee-project-1',
    title: 'Molecular Biology Training Program',
    projectType: 'Trainee Project',
    status: 'Active',
  },
  {
    id: 'resource-project-2',
    title: 'Open-Source Analysis Pipeline',
    projectType: 'Resource Project',
    status: 'Closed',
  },
];

describe('UserProjectsCard', () => {
  it('renders empty state when no projects', () => {
    render(<UserProjectsCard projects={[]} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(
      screen.getByText('This user is not currently assigned to any projects.'),
    ).toBeInTheDocument();
  });

  it('renders project table with headers', () => {
    render(<UserProjectsCard projects={mockProjects} />);

    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('displays project titles and types correctly', () => {
    render(<UserProjectsCard projects={mockProjects} />);

    expect(
      screen.getByText('Understanding Genetic Mechanisms in PD'),
    ).toBeInTheDocument();
    expect(screen.getByText('PD Biobank Resource')).toBeInTheDocument();
    expect(
      screen.getByText('Molecular Biology Training Program'),
    ).toBeInTheDocument();

    // Check project types
    expect(screen.getAllByText('Discovery Project')).toHaveLength(1);
    expect(screen.getAllByText('Resource Project')).toHaveLength(2);
    expect(screen.getAllByText('Trainee Project')).toHaveLength(1);
  });

  it('displays status badges correctly', () => {
    render(<UserProjectsCard projects={mockProjects} />);

    // Active status should show "Active" (2 projects have Active status)
    expect(screen.getAllByText('Active')).toHaveLength(2);

    // Completed/Closed statuses should show "Complete" (2 projects have Complete status)
    expect(screen.getAllByText('Complete')).toHaveLength(2);
  });

  it('creates correct links for different project types', () => {
    render(<UserProjectsCard projects={mockProjects} />);

    const discoveryLink = screen.getByRole('link', {
      name: /Understanding Genetic Mechanisms in PD/,
    });
    expect(discoveryLink).toHaveAttribute(
      'href',
      '/projects/discovery/discovery-project-1',
    );

    const resourceLink = screen.getByRole('link', {
      name: /PD Biobank Resource/,
    });
    expect(resourceLink).toHaveAttribute(
      'href',
      '/projects/resource/resource-project-1',
    );

    const traineeLink = screen.getByRole('link', {
      name: /Molecular Biology Training Program/,
    });
    expect(traineeLink).toHaveAttribute(
      'href',
      '/projects/trainee/trainee-project-1',
    );
  });

  it('shows "Show more" button when more than 6 projects', () => {
    const manyProjects = Array.from({ length: 8 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    render(<UserProjectsCard projects={manyProjects} />);

    expect(screen.getByText(/Show more/)).toBeInTheDocument();
  });

  it('toggles between show more and show less', () => {
    const manyProjects = Array.from({ length: 8 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    render(<UserProjectsCard projects={manyProjects} />);

    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    expect(screen.getByText(/Show less/)).toBeInTheDocument();
  });

  it('does not show show more button when 6 or fewer projects', () => {
    const fewProjects = Array.from({ length: 6 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    render(<UserProjectsCard projects={fewProjects} />);

    expect(screen.queryByText(/Show more/)).not.toBeInTheDocument();
  });

  it('shows all projects after clicking show more', () => {
    const manyProjects = Array.from({ length: 8 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    render(<UserProjectsCard projects={manyProjects} />);

    // Initially should show first 6 projects
    expect(screen.getByText('Project 0')).toBeInTheDocument();
    expect(screen.getByText('Project 5')).toBeInTheDocument();

    // Click show more
    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    // Should now show all 8 projects
    expect(screen.getByText('Project 6')).toBeInTheDocument();
    expect(screen.getByText('Project 7')).toBeInTheDocument();
  });

  it('shows correct status for different project statuses', () => {
    const projectsWithDifferentStatuses: UserProjectMembership[] = [
      {
        id: 'active-project',
        title: 'Active Project',
        projectType: 'Discovery Project',
        status: 'Active',
      },
      {
        id: 'completed-project',
        title: 'Completed Project',
        projectType: 'Resource Project',
        status: 'Completed',
      },
      {
        id: 'closed-project',
        title: 'Closed Project',
        projectType: 'Resource Project',
        status: 'Closed',
      },
      {
        id: 'paused-project',
        title: 'Paused Project',
        projectType: 'Discovery Project',
        status: 'Paused',
      },
    ];

    render(<UserProjectsCard projects={projectsWithDifferentStatuses} />);

    // Active should show "Active"
    expect(screen.getByText('Active')).toBeInTheDocument();

    // Completed and Closed should show "Complete"
    expect(screen.getAllByText('Complete')).toHaveLength(2);

    // Other status (Paused) should show the actual status
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('renders project without link when project type is unknown', () => {
    // Use type assertion to test unknown project type case
    const projectWithUnknownType = {
      id: 'unknown-project',
      title: 'Unknown Type Project',
      projectType: 'Unknown Project Type' as any,
      status: 'Active',
    };

    render(<UserProjectsCard projects={[projectWithUnknownType]} />);

    // Should render the title but not as a link
    expect(screen.getByText('Unknown Type Project')).toBeInTheDocument();
    
    // Should not have a link (should be a span, not an anchor)
    const projectElement = screen.getByText('Unknown Type Project');
    expect(projectElement.tagName).toBe('SPAN');
    expect(projectElement).not.toHaveAttribute('href');
  });

  it('renders fallback status badge for statuses that are not Active, Completed, or Closed', () => {
    const projectWithOtherStatus: UserProjectMembership[] = [
      {
        id: 'other-status-project',
        title: 'Other Status Project',
        projectType: 'Discovery Project',
        status: 'On Hold',
      },
    ];

    render(<UserProjectsCard projects={projectWithOtherStatus} />);

    // Should show the actual status text
    expect(screen.getByText('On Hold')).toBeInTheDocument();
    
    // Should not show "Active" or "Complete"
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
  });
});
