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
    render(<TeamProjectsCard {...baseProps} />);

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
});
