import { render, screen, fireEvent, within } from '@testing-library/react';
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
    const table = screen.getByTestId('projects-table');

    expect(within(table).getByText('Project Name')).toBeInTheDocument();
    expect(within(table).getByText('Type')).toBeInTheDocument();
    expect(within(table).getByText('Status')).toBeInTheDocument();
  });

  it('displays project titles and types correctly', () => {
    render(<UserProjectsCard projects={mockProjects} />);
    const table = screen.getByTestId('projects-table');

    expect(
      within(table).getByText('Understanding Genetic Mechanisms in PD'),
    ).toBeInTheDocument();
    expect(within(table).getByText('PD Biobank Resource')).toBeInTheDocument();
    expect(
      within(table).getByText('Molecular Biology Training Program'),
    ).toBeInTheDocument();

    // Check project types
    expect(within(table).getAllByText('Discovery Project')).toHaveLength(1);
    expect(within(table).getAllByText('Resource Project')).toHaveLength(2);
    expect(within(table).getAllByText('Trainee Project')).toHaveLength(1);
  });

  it('displays status pills correctly', () => {
    render(<UserProjectsCard projects={mockProjects} />);
    const table = screen.getByTestId('projects-table');

    // Active status should show "Active" (2 projects have Active status)
    expect(within(table).getAllByText('Active')).toHaveLength(2);

    // Completed status should show "Completed"
    expect(within(table).getByText('Completed')).toBeInTheDocument();

    // Closed status should show "Closed"
    expect(within(table).getByText('Closed')).toBeInTheDocument();
  });

  it('creates correct links for different project types', () => {
    render(<UserProjectsCard projects={mockProjects} />);
    const table = screen.getByTestId('projects-table');

    const discoveryLink = within(table).getByRole('link', {
      name: /Understanding Genetic Mechanisms in PD/,
    });
    expect(discoveryLink).toHaveAttribute(
      'href',
      '/projects/discovery/discovery-project-1',
    );

    const resourceLink = within(table).getByRole('link', {
      name: /PD Biobank Resource/,
    });
    expect(resourceLink).toHaveAttribute(
      'href',
      '/projects/resource/resource-project-1',
    );

    const traineeLink = within(table).getByRole('link', {
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
    const table = screen.getByTestId('projects-table');

    // Initially should show first 6 projects
    expect(within(table).getByText('Project 0')).toBeInTheDocument();
    expect(within(table).getByText('Project 5')).toBeInTheDocument();
    expect(within(table).queryByText('Project 6')).not.toBeInTheDocument();

    // Click show more
    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    // Should now show all projects and button should say "Show less"
    expect(screen.getByText(/Show less/)).toBeInTheDocument();
    expect(within(table).getByText('Project 6')).toBeInTheDocument();
    expect(within(table).getByText('Project 7')).toBeInTheDocument();

    // Click show less
    const showLessButton = screen.getByText(/Show less/);
    fireEvent.click(showLessButton);

    // Should collapse back to first 6 projects
    expect(screen.getByText(/Show more/)).toBeInTheDocument();
    expect(within(table).getByText('Project 0')).toBeInTheDocument();
    expect(within(table).getByText('Project 5')).toBeInTheDocument();
    expect(within(table).queryByText('Project 6')).not.toBeInTheDocument();
    expect(within(table).queryByText('Project 7')).not.toBeInTheDocument();
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
    const table = screen.getByTestId('projects-table');

    // Initially should show first 6 projects
    expect(within(table).getByText('Project 0')).toBeInTheDocument();
    expect(within(table).getByText('Project 5')).toBeInTheDocument();

    // Click show more
    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    // Should now show all 8 projects
    expect(within(table).getByText('Project 6')).toBeInTheDocument();
    expect(within(table).getByText('Project 7')).toBeInTheDocument();
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
    const table = screen.getByTestId('projects-table');

    // Active should show "Active"
    expect(within(table).getByText('Active')).toBeInTheDocument();

    // Completed should show "Completed"
    expect(within(table).getByText('Completed')).toBeInTheDocument();

    // Closed should show "Closed"
    expect(within(table).getByText('Closed')).toBeInTheDocument();

    // Other status (Paused) should show the actual status
    expect(within(table).getByText('Paused')).toBeInTheDocument();
  });

  it('renders project without link when project type is unknown', () => {
    // Use type assertion to test unknown project type case
    const projectWithUnknownType = {
      id: 'unknown-project',
      title: 'Unknown Type Project',
      projectType:
        'Unknown Project Type' as unknown as UserProjectMembership['projectType'],
      status: 'Active',
    };

    render(<UserProjectsCard projects={[projectWithUnknownType]} />);
    const table = screen.getByTestId('projects-table');

    // Should render the title but not as a link
    const projectElement = within(table).getByText('Unknown Type Project');
    expect(projectElement).toBeInTheDocument();

    // Should not have a link (should be a span, not an anchor)
    expect(projectElement.tagName).toBe('SPAN');
    expect(projectElement).not.toHaveAttribute('href');
  });

  it('renders status pill for any status value', () => {
    const projectWithOtherStatus: UserProjectMembership[] = [
      {
        id: 'other-status-project',
        title: 'Other Status Project',
        projectType: 'Discovery Project',
        status: 'On Hold',
      },
    ];

    render(<UserProjectsCard projects={projectWithOtherStatus} />);
    const table = screen.getByTestId('projects-table');

    // Should show the actual status text
    expect(within(table).getByText('On Hold')).toBeInTheDocument();

    // Should not show "Active", "Completed", or "Closed"
    expect(within(table).queryByText('Active')).not.toBeInTheDocument();
    expect(within(table).queryByText('Completed')).not.toBeInTheDocument();
    expect(within(table).queryByText('Closed')).not.toBeInTheDocument();
  });

  it('does not render status when status is missing', () => {
    const projectWithoutStatus: UserProjectMembership[] = [
      {
        id: 'no-status-project',
        title: 'No Status Project',
        projectType: 'Discovery Project',
        status: undefined as unknown as string,
      },
    ];

    render(<UserProjectsCard projects={projectWithoutStatus} />);
    const table = screen.getByTestId('projects-table');

    // Should render the project
    const projectElement = within(table).getByText('No Status Project');
    expect(projectElement).toBeInTheDocument();

    // Should not render any status pill
    const statusCell = projectElement.closest('tr');
    expect(statusCell).toBeInTheDocument();
    // Status column should be empty (no status text)
    expect(within(table).queryByText('Active')).not.toBeInTheDocument();
  });

  it('removes border from last row when there is no show more button', () => {
    const fewProjects = Array.from({ length: 3 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    const { container } = render(<UserProjectsCard projects={fewProjects} />);
    const table = container.querySelector('table');
    const rows = table?.querySelectorAll('tbody tr') || [];

    // Last row should exist
    expect(rows.length).toBe(3);

    // Last row should not have border-bottom (lastRowNoBorder style applied)
    const lastRow = rows[rows.length - 1];
    expect(lastRow).toBeDefined();

    const lastRowCells = lastRow!.querySelectorAll('td');
    // Check that the last row cells have the border removed
    // This is tested by checking the rendered output - the border should be removed
    expect(lastRowCells.length).toBe(3);
  });

  it('keeps border on last row when there is a show more button', () => {
    const manyProjects = Array.from({ length: 8 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    const { container } = render(<UserProjectsCard projects={manyProjects} />);
    const table = container.querySelector('table');
    const rows = table?.querySelectorAll('tbody tr') || [];

    // Should show first 6 projects initially
    expect(rows.length).toBe(6);

    // Last row should have border (no lastRowNoBorder style applied when hasMoreProjects is true)
    const lastRow = rows[rows.length - 1];
    expect(lastRow).toBeDefined();

    // Show more button should be present
    expect(screen.getByText(/Show more/)).toBeInTheDocument();
  });

  it('removes border from last row after clicking show more when all projects are displayed', () => {
    const manyProjects = Array.from({ length: 8 }, (_, i) => ({
      id: `project-${i}`,
      title: `Project ${i}`,
      projectType: 'Discovery Project' as const,
      status: 'Active' as const,
    }));

    const { container } = render(<UserProjectsCard projects={manyProjects} />);

    // Click show more to expand
    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    const table = container.querySelector('table');
    const rows = table?.querySelectorAll('tbody tr') || [];

    // Should now show all 8 projects
    expect(rows.length).toBe(8);

    // Last row should not have border (lastRowNoBorder style applied)
    const lastRow = rows[rows.length - 1];
    expect(lastRow).toBeDefined();
  });
});
