import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProjects from '../UserProjects';

describe('UserProjects', () => {
  type Project = gp2.UserResponse['projects'][number];
  const getProjects = (length = 1): Project[] =>
    Array.from({ length }, (_, itemIndex) => ({
      id: `id-${itemIndex}`,
      title: `a title ${itemIndex}`,
      members: [],
      status: 'Active',
    }));
  const firstName: gp2.UserResponse['firstName'] = 'John';
  const id = 'user-id';
  const renderUserProjects = (projects: Project[]) =>
    render(<UserProjects projects={projects} firstName={firstName} id={id} />);
  it('renders the short text when there are no projects', () => {
    renderUserProjects([]);
    expect(
      screen.getByText(`${firstName} has been involved`, { exact: false }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: /you are not associated to any projects/i,
      }),
    ).toBeVisible();
  });

  it('renders project titles', () => {
    renderUserProjects(getProjects(2));
    expect(screen.getByRole('link', { name: 'a title 0' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'a title 1' })).toBeVisible();
  });

  it.each(gp2.projectStatus)('renders the status - %s', (status) => {
    const project = { ...getProjects(1)[0]!, status };
    render(<UserProjects projects={[project]} firstName={firstName} id={id} />);
    expect(screen.getByText(status)).toBeVisible();
  });

  it.each(gp2.projectMemberRole)('renders the role - %s', (role) => {
    const project: Project = {
      ...getProjects(1)[0]!,
      members: [{ userId: id, role }],
    };
    render(<UserProjects projects={[project]} firstName={firstName} id={id} />);
    expect(screen.getByText(role)).toBeVisible();
  });

  it('should not render role column if onboarding', () => {
    const project = {
      ...getProjects(1)[0]!,
      members: [{ userId: id, role: gp2.projectMemberRole[0] }],
    };
    render(
      <UserProjects
        projects={[project]}
        firstName={firstName}
        id={id}
        isOnboarding
      />,
    );
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });

  it('renders show more button for more than 3 projects', async () => {
    const projects = getProjects(4);

    renderUserProjects(projects);

    expect(screen.getByRole('button', { name: /Show more/i })).toBeVisible();
  });
  it('renders show less button when the show more button is clicked', async () => {
    const projects = getProjects(4);

    renderUserProjects(projects);

    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByRole('button', { name: /Show less/i })).toBeVisible();
  });
  it('does not show a more button for less than 3 projects', async () => {
    const projects = getProjects(3);

    renderUserProjects(projects);

    expect(
      screen.queryByRole('button', { name: /Show more/i }),
    ).not.toBeInTheDocument();
  });
  it('displays the hidden projects if the show more button is clicked', () => {
    const projects = getProjects(4);

    renderUserProjects(projects);

    expect(screen.getByRole('link', { name: 'a title 2' })).toBeVisible();
    expect(screen.getByText('a title 3')).not.toBeVisible();
    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByText('a title 3')).toBeVisible();
  });
});
