import { render, screen } from '@testing-library/react';
import TeamProjectsCard from '../TeamProjectsCard';

const baseProps = {
  teamType: 'Discovery Team' as const,
  projectTitle: 'Project Alpha',
  projectSummary: 'Original grant summary',
  linkedProjectId: 'proj-1',
  projectStatus: 'Active' as const,
  supplementGrant: undefined,
  researchTheme: 'Neurodegeneration',
  resourceType: undefined,
};

describe('TeamProjectsCard', () => {
  it('renders nothing when there is no linked project', () => {
    const { container } = render(
      <TeamProjectsCard
        {...baseProps}
        projectTitle=""
        linkedProjectId={undefined}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders funded project information with title link', () => {
    render(<TeamProjectsCard {...baseProps} projectType="Discovery Project" />);

    expect(
      screen.getByRole('heading', { name: /projects/i }),
    ).toBeInTheDocument();
    const titleLink = screen.getByRole('link', { name: 'Project Alpha' });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute(
      'href',
      expect.stringContaining('/projects/discovery/'),
    );
  });

  it('uses supplement grant description when present', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        supplementGrant={{ title: 'Supp', description: 'Supplement text' }}
      />,
    );

    expect(screen.getByText('Supplement text')).toBeInTheDocument();
    expect(
      screen.queryByText('Original grant summary'),
    ).not.toBeInTheDocument();
  });

  it('displays project status when provided', () => {
    render(<TeamProjectsCard {...baseProps} projectStatus="Completed" />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('does not display status pill when projectStatus is not provided', () => {
    render(<TeamProjectsCard {...baseProps} projectStatus={undefined} />);

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(screen.queryByText('Closed')).not.toBeInTheDocument();
  });

  it('renders resource project with resource project route based on projectType', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        teamType="Discovery Team"
        projectType="Resource Project"
        researchTheme={undefined}
        resourceType="Isogenic iPSC Lines"
      />,
    );

    const titleLink = screen.getByRole('link', { name: 'Project Alpha' });
    expect(titleLink).toHaveAttribute(
      'href',
      expect.stringContaining('/projects/resource/'),
    );
  });

  it('renders discovery project with discovery project route based on projectType', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        teamType="Resource Team"
        projectType="Discovery Project"
        researchTheme="Neurodegeneration"
        resourceType={undefined}
      />,
    );

    const titleLink = screen.getByRole('link', { name: 'Project Alpha' });
    expect(titleLink).toHaveAttribute(
      'href',
      expect.stringContaining('/projects/discovery/'),
    );
  });

  it('displays projectType pill', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        teamType="Discovery Team"
        projectType="Resource Project"
        researchTheme={undefined}
        resourceType="Isogenic iPSC Lines"
      />,
    );

    expect(screen.getByText('Resource Project')).toBeInTheDocument();
    expect(screen.queryByText('Discovery Team')).not.toBeInTheDocument();
    expect(screen.getByText('Isogenic iPSC Lines')).toBeInTheDocument();
  });

  it('displays research theme pill for discovery project based on projectType', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        teamType="Resource Team"
        projectType="Discovery Project"
        researchTheme="Neurodegeneration"
        resourceType={undefined}
      />,
    );

    expect(screen.getByText('Discovery Project')).toBeInTheDocument();
    expect(screen.getByText('Neurodegeneration')).toBeInTheDocument();
    expect(screen.queryByText('Resource Team')).not.toBeInTheDocument();
  });

  it('displays resource type pill for resource project based on projectType', () => {
    render(
      <TeamProjectsCard
        {...baseProps}
        teamType="Discovery Team"
        projectType="Resource Project"
        researchTheme={undefined}
        resourceType="Isogenic iPSC Lines"
      />,
    );

    expect(screen.getByText('Resource Project')).toBeInTheDocument();
    expect(screen.getByText('Isogenic iPSC Lines')).toBeInTheDocument();
    expect(screen.queryByText('Discovery Team')).not.toBeInTheDocument();
  });
});
