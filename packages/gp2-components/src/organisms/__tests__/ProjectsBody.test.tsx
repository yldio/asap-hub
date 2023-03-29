import { gp2 } from '@asap-hub/fixtures';
import { ResultList } from '@asap-hub/react-components';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ProjectsBody from '../ProjectsBody';

describe('ProjectsBody', () => {
  const props: Omit<ComponentProps<typeof ResultList>, 'children'> = {
    numberOfPages: 1,
    numberOfItems: 3,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };
  it("renders the empty page if there aren't any projects", () => {
    render(<ProjectsBody {...props} projects={[]} />);
    expect(
      screen.getByRole('heading', { name: /no projects available/i }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'When a GP2 admin creates a project, it will be listed here.',
      ),
    ).toBeVisible();
  });

  it('renders a project', () => {
    render(
      <ProjectsBody {...props} projects={gp2.createProjectsResponse().items} />,
    );
    expect(
      screen.getByRole('heading', { name: /Project Title/i }),
    ).toBeVisible();
  });

  it('renders multiple projects', () => {
    const projects = [
      gp2.createProjectResponse({ id: '11', title: 'Project 11' }),
      gp2.createProjectResponse({ id: '42', title: 'Project 42' }),
    ];

    const projectsResponse = gp2.createProjectsResponse(projects);

    render(<ProjectsBody {...props} projects={projectsResponse.items} />);
    expect(screen.getByRole('heading', { name: /Project 11/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /Project 42/i })).toBeVisible();
  });
});
