import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { gp2 as gp2Routing, logout } from '@asap-hub/routing';
import UserMenu from '../UserMenu';

const { projects: projectsRoute, workingGroups: workingGroupsRoute } =
  gp2Routing;

describe('UserMenu', () => {
  const props: ComponentProps<typeof UserMenu> = {
    userId: '1',
    projects: [],
    workingGroups: [],
    menuShown: false,
    closeUserMenu: jest.fn(),
  };

  it('renders the navigation items', () => {
    render(<UserMenu {...props} />);
    const link = screen.getByRole('link', { name: /log out/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', logout({}).$);
  });

  it('renders the projects', () => {
    const projects: typeof props['projects'] = [
      {
        id: '11',
        title: 'the first project title',
        status: 'Active',
        members: [],
      },
      {
        id: '23',
        title: 'the second project title',
        status: 'Active',
        members: [],
      },
    ];
    render(<UserMenu {...props} projects={projects} />);
    expect(
      screen.getByRole('link', { name: /the first project title/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: /the second project title/i }),
    ).toBeVisible();
  });

  it('links to the project details', () => {
    const projects: typeof props['projects'] = [
      {
        id: '11',
        title: 'the first project title',
        status: 'Active',
        members: [],
      },
    ];
    render(<UserMenu {...props} projects={projects} />);
    expect(
      screen.getByRole('link', { name: /the first project title/i }),
    ).toHaveAttribute(
      'href',
      projectsRoute({}).project({ projectId: projects[0].id }).$,
    );
  });

  it('renders only active projects', () => {
    const projects: typeof props['projects'] = [
      {
        id: '11',
        title: 'the first project title',
        status: 'Active',
        members: [],
      },
      {
        id: '23',
        title: 'the second project title',
        status: 'Paused',
        members: [],
      },
      {
        id: '27',
        title: 'the third project title',
        status: 'Completed',
        members: [],
      },
    ];
    render(<UserMenu {...props} projects={projects} />);
    expect(
      screen.getByRole('link', { name: /the first project title/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole('link', { name: /the second project title/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /the third project title/i }),
    ).not.toBeInTheDocument();
  });

  it('renders the working groups', () => {
    const workingGroups: typeof props['workingGroups'] = [
      {
        id: '11',
        title: 'the first wg title',
        members: [],
      },
      {
        id: '23',
        title: 'the second wg title',
        members: [],
      },
    ];
    render(<UserMenu {...props} workingGroups={workingGroups} />);
    expect(
      screen.getByRole('link', { name: /the first wg title/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: /the second wg title/i }),
    ).toBeVisible();
  });

  it('links to the working group detail page', () => {
    const workingGroups: typeof props['workingGroups'] = [
      {
        id: '11',
        title: 'the first wg title',
        members: [],
      },
    ];
    render(<UserMenu {...props} workingGroups={workingGroups} />);
    expect(
      screen.getByRole('link', { name: /the first wg title/i }),
    ).toHaveAttribute(
      'href',
      workingGroupsRoute({}).workingGroup({
        workingGroupId: workingGroups[0].id,
      }).$,
    );
  });
});
