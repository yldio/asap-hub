import { render, screen } from '@testing-library/react';
import { ProjectDetail } from '@asap-hub/model';
import ProjectDetailPage from '../ProjectDetailPage';

const mockProject: ProjectDetail = {
  id: 'project-1',
  title: 'Test Project',
  status: 'Active',
  projectType: 'Discovery Project',
  researchTheme: 'Genetics',
  teamName: 'Test Team',
  startDate: '2023-01-01',
  endDate: '2025-12-31',
  duration: '3 yrs',
  tags: ['Tag1', 'Tag2'],
  originalGrant: 'Grant Title',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
    grantDescription: 'Supplement grant description',
    grantProposalId: 'proposal-1',
    grantStartDate: '2023-01-01',
    grantEndDate: '2025-12-31',
  },
  fundedTeam: {
    id: 'team-1',
    displayName: 'Test Team',
    teamType: 'Discovery Team',
    researchTheme: 'Genetics',
  },
};

describe('ProjectDetailPage', () => {
  it('renders the project detail header', () => {
    render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders children content in main section', () => {
    render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('passes pointOfContactEmail to header when provided', () => {
    render(
      <ProjectDetailPage
        {...mockProject}
        aboutHref="/projects/1/about"
        pointOfContactEmail="contact@example.com"
      >
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('does not show contact button when no email provided', () => {
    render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
  });

  it('renders article wrapper element', () => {
    const { container } = render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders main element with children', () => {
    const { container } = render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent('Test Content');
  });

  it('passes aboutHref to ProjectDetailHeader', () => {
    render(
      <ProjectDetailPage {...mockProject} aboutHref="/projects/1/about">
        <div>Test Content</div>
      </ProjectDetailPage>,
    );

    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toHaveAttribute('href', '/projects/1/about');
  });
});
