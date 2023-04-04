import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { gp2 as gp2Routing, logout } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';
import UserMenu from '../UserMenu';

const {
  users: usersRoute,
  projects: projectsRoute,
  workingGroups: workingGroupsRoute,
} = gp2Routing;

describe('UserMenu', () => {
  const props: ComponentProps<typeof UserMenu> = {
    userId: '1',
    projects: [],
    workingGroups: [],
    closeUserMenu: jest.fn(),
  };

  it('renders the navigation items', () => {
    render(<UserMenu {...props} />);
    const profileLink = screen.getByRole('link', { name: /my profile/i });
    expect(profileLink).toBeVisible();
    expect(profileLink).toHaveAttribute(
      'href',
      usersRoute({}).user({ userId: '1' }).$,
    );
    const logoutLink = screen.getByRole('link', { name: /log out/i });
    expect(logoutLink).toBeVisible();
    expect(logoutLink).toHaveAttribute('href', logout({}).$);
  });

  it('verifies the my profile button is clickable', () => {
    const closeUserMenu = jest.fn();
    render(<UserMenu {...props} closeUserMenu={closeUserMenu} />);
    const profileLink = screen.getByRole('link', { name: /my profile/i });
    userEvent.click(profileLink);
    expect(closeUserMenu).toBeCalledWith(false);
  });

  it('renders the projects', () => {
    const projects: (typeof props)['projects'] = [
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
    const closeUserMenu = jest.fn();
    const projects: (typeof props)['projects'] = [
      {
        id: '11',
        title: 'the first project title',
        status: 'Active',
        members: [],
      },
    ];
    render(
      <UserMenu {...props} projects={projects} closeUserMenu={closeUserMenu} />,
    );
    expect(
      screen.getByRole('link', { name: /the first project title/i }),
    ).toHaveAttribute(
      'href',
      projectsRoute({}).project({ projectId: projects[0]!.id }).$,
    );

    userEvent.click(
      screen.getByRole('link', { name: /the first project title/i }),
    );

    expect(closeUserMenu).toBeCalledWith(false);
  });

  it('renders only active projects', () => {
    const projects: (typeof props)['projects'] = [
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
    const workingGroups: (typeof props)['workingGroups'] = [
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
    const closeUserMenu = jest.fn();
    const workingGroups: (typeof props)['workingGroups'] = [
      {
        id: '11',
        title: 'the first wg title',
        members: [],
      },
    ];
    render(
      <UserMenu
        {...props}
        workingGroups={workingGroups}
        closeUserMenu={closeUserMenu}
      />,
    );
    expect(
      screen.getByRole('link', { name: /the first wg title/i }),
    ).toHaveAttribute(
      'href',
      workingGroupsRoute({}).workingGroup({
        workingGroupId: workingGroups[0]!.id,
      }).$,
    );

    userEvent.click(screen.getByRole('link', { name: /the first wg title/i }));

    expect(closeUserMenu).toBeCalledWith(false);
  });

  it('closes when the user clicks outside the User Menu', () => {
    const closeUserMenu = jest.fn();
    render(
      <>
        <h1>Title</h1>
        <UserMenu {...props} closeUserMenu={closeUserMenu} />{' '}
      </>,
    );
    fireEvent.mouseDown(screen.getByRole('heading'));
    expect(closeUserMenu).toBeCalledWith(false);
  });

  it('renders the bottom links', () => {
    render(<UserMenu {...props} />);
    expect(screen.getByText(/terms/i)).toBeVisible();
    expect(screen.getByText(/privacy/i)).toBeVisible();
  });
});
