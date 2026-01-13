import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import UserNavigation from '../UserNavigation';

const props: ComponentProps<typeof UserNavigation> = {
  userProfileHref: '/profile',
  teams: [
    { name: 'Team 1', href: '/team-1' },
    { name: 'Team 2', href: '/team-2' },
  ],
  workingGroups: [
    {
      name: 'Working Group 1',
      href: '/working-group-1',
      active: true,
    },
  ],
  interestGroups: [
    {
      name: 'Interest Group 1',
      href: '/interest-group-1',
      active: true,
    },
  ],
  aboutHref: '/about',
};

it('renders the bottom links', () => {
  const { getByText } = render(
    <MemoryRouter>
      <UserNavigation {...props} />
    </MemoryRouter>,
  );
  expect(getByText(/terms/i)).toBeVisible();
  expect(getByText(/privacy/i)).toBeVisible();
  expect(getByText(/about/i)).toBeVisible();
});

it('applies the passed href', () => {
  const { getAllByRole } = render(
    <MemoryRouter>
      <UserNavigation {...props} userProfileHref="/profile" />
    </MemoryRouter>,
  );
  expect(
    getAllByRole('link').find(({ textContent }) =>
      /profile/i.test(textContent ?? ''),
    ),
  ).toHaveAttribute('href', '/profile');
});

it('renders the associations sections', () => {
  const { getByText } = render(
    <MemoryRouter>
      <UserNavigation {...props} />
    </MemoryRouter>,
  );
  expect(getByText('MY TEAMS')).toBeVisible();
  expect(getByText(/team 1/i)).toBeVisible();
  expect(getByText(/team 2/i)).toBeVisible();

  expect(getByText('MY INTEREST GROUPS')).toBeVisible();
  expect(getByText(/interest group 1/i)).toBeVisible();

  expect(getByText('MY WORKING GROUPS')).toBeVisible();
  expect(getByText(/working group 1/i)).toBeVisible();
});

it('does not render the associations sections for missing associations', () => {
  const { queryByText } = render(
    <MemoryRouter>
      <UserNavigation {...props} interestGroups={[]} workingGroups={[]} />
    </MemoryRouter>,
  );

  expect(queryByText('MY INTEREST GROUPS')).not.toBeInTheDocument();
  expect(queryByText('MY WORKING GROUPS')).not.toBeInTheDocument();
});

it('does not render the associations sections if associations are not active', () => {
  const { queryByText } = render(
    <MemoryRouter>
      <UserNavigation
        {...props}
        interestGroups={[
          {
            name: 'Interest Group 1',
            href: '/interest-group-1',
            active: false,
          },
        ]}
        workingGroups={[
          {
            name: 'Working Group 1',
            href: '/working-group-1',
            active: false,
          },
        ]}
      />
    </MemoryRouter>,
  );

  expect(queryByText('MY INTEREST GROUPS')).not.toBeInTheDocument();
  expect(queryByText('MY WORKING GROUPS')).not.toBeInTheDocument();
});

it('does only renders associations which are active', () => {
  const { queryByText } = render(
    <MemoryRouter>
      <UserNavigation
        {...props}
        interestGroups={[
          {
            name: 'Interest Group 1',
            href: '/interest-group-1',
            active: false,
          },
          {
            name: 'Interest Group 2',
            href: '/interest-group-2',
            active: true,
          },
        ]}
      />
    </MemoryRouter>,
  );

  expect(queryByText('MY INTEREST GROUPS')).toBeVisible();
  expect(queryByText('Interest Group 1')).not.toBeInTheDocument();
  expect(queryByText('Interest Group 2')).toBeVisible();
});

describe('Project icons', () => {
  it('renders MY PROJECTS section when projects are provided', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserNavigation
          {...props}
          projects={[
            {
              name: 'My Project',
              href: '/project-1',
              projectType: 'Discovery Project',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(getByText('MY PROJECTS')).toBeVisible();
    expect(getByText('My Project')).toBeVisible();
  });

  it('does not render MY PROJECTS section when projects array is empty', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <UserNavigation {...props} projects={[]} />
      </MemoryRouter>,
    );

    expect(queryByText('MY PROJECTS')).not.toBeInTheDocument();
  });

  it('does not render MY PROJECTS section when projects is undefined', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <UserNavigation {...props} />
      </MemoryRouter>,
    );

    expect(queryByText('MY PROJECTS')).not.toBeInTheDocument();
  });

  it('renders Discovery Project icon for Discovery Project type', () => {
    const { getByTitle } = render(
      <MemoryRouter>
        <UserNavigation
          {...props}
          projects={[
            {
              name: 'Discovery Research',
              href: '/discovery-1',
              projectType: 'Discovery Project',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(getByTitle('Discovery Project')).toBeInTheDocument();
  });

  it('renders Resource Project icon for Resource Project type', () => {
    const { getByTitle } = render(
      <MemoryRouter>
        <UserNavigation
          {...props}
          projects={[
            {
              name: 'Resource Initiative',
              href: '/resource-1',
              projectType: 'Resource Project',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(getByTitle('Resource Project')).toBeInTheDocument();
  });

  it('renders Trainee Project icon for Trainee Project type', () => {
    const { getByTitle } = render(
      <MemoryRouter>
        <UserNavigation
          {...props}
          projects={[
            {
              name: 'Trainee Study',
              href: '/trainee-1',
              projectType: 'Trainee Project',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(getByTitle('Trainee Project')).toBeInTheDocument();
  });

  it('renders correct icons for multiple projects of different types', () => {
    const { getByTitle, getByText } = render(
      <MemoryRouter>
        <UserNavigation
          {...props}
          projects={[
            {
              name: 'Discovery Research',
              href: '/discovery-1',
              projectType: 'Discovery Project',
            },
            {
              name: 'Resource Initiative',
              href: '/resource-1',
              projectType: 'Resource Project',
            },
            {
              name: 'Trainee Study',
              href: '/trainee-1',
              projectType: 'Trainee Project',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(getByText('Discovery Research')).toBeVisible();
    expect(getByText('Resource Initiative')).toBeVisible();
    expect(getByText('Trainee Study')).toBeVisible();
    expect(getByTitle('Discovery Project')).toBeInTheDocument();
    expect(getByTitle('Resource Project')).toBeInTheDocument();
    expect(getByTitle('Trainee Project')).toBeInTheDocument();
  });
});
