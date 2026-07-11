import { authTestUtils } from '@asap-hub/react-components';
import { cleanup, render, waitFor } from '@testing-library/react';
import { Suspense, useEffect, useState } from 'react';
import { MemoryRouter, StaticRouter } from 'react-router';
import nock from 'nock';

import { useCurrentUserCRN } from '@asap-hub/react-context';
import userEvent from '@testing-library/user-event';
import { useAuthorization } from '../auth/useAuthorization';
import AuthenticatedApp from '../AuthenticatedApp';
import Dashboard from '../dashboard/Dashboard';

// We're not actually interested in testing what's rendered since it's all
// declarative routes at this level - get any backend requests out of the way
// so that it just easily renders
jest.mock('../dashboard/Dashboard', () => jest.fn());
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useCurrentUserCRN: jest.fn(),
}));

const mockedUser = {
  id: 'user-1',
  role: 'Staff',
  onboarded: true,
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  avatarUrl: '',
  teams: [
    {
      id: 'test-team-id-1',
      displayName: 'Team One',
      role: 'ASAP Staff',
    },
  ],
  workingGroups: [
    {
      id: 'working-group-id-1',
      active: true,
      name: 'Working Group One',
      role: 'Project Manager',
    },
  ],
  interestGroups: [
    {
      id: 'interest-group-id-1',
      active: true,
      name: 'Interest Group One',
    },
  ],
  algoliaApiKey: '',
  email: 'test@example.io',
  openScienceTeamMember: true,
};

const MockDashboard = Dashboard as jest.MockedFunction<typeof Dashboard>;
beforeEach(() => {
  cleanup();
  MockDashboard.mockReset().mockReturnValue(null);
  (useCurrentUserCRN as jest.Mock).mockReturnValue(mockedUser);

  // Mock OpenSearch endpoints that might be called when rendering Analytics routes
  nock('http://localhost:3333')
    .post('/opensearch/search/user-productivity')
    .reply(200, {
      hits: {
        total: { value: 0 },
        hits: [],
      },
    })
    .persist();
});

afterEach(() => {
  nock.cleanAll();
});

const AuthorizationProbe = () => {
  const getAuthorization = useAuthorization();
  const [authorization, setAuthorization] = useState('');
  useEffect(() => {
    // Swallow the "not ready" rejection thrown while auth0 is still loading;
    // the effect re-runs with a ready accessor once loading flips to false.
    getAuthorization()
      .then(setAuthorization)
      .catch(() => {});
  }, [getAuthorization]);
  return <>{authorization}</>;
};

it('exposes the auth token to the app tree via useAuthorization', async () => {
  MockDashboard.mockImplementation(() => <AuthorizationProbe />);
  const { findByText } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <StaticRouter location="/">
          <Suspense fallback="loading">
            <AuthenticatedApp />
          </Suspense>
        </StaticRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  const tokenElement = await findByText(
    /Bearer token/i,
    {},
    { timeout: 10000 },
  );
  expect(tokenElement).toBeVisible();
});
it("should call setIsOnboardable if it's set", async () => {
  const setIsOnboardable = jest.fn();
  render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <StaticRouter location="/">
          <Suspense fallback="loading">
            <AuthenticatedApp setIsOnboardable={setIsOnboardable} />
          </Suspense>
        </StaticRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  await waitFor(
    () => {
      expect(setIsOnboardable).toHaveBeenCalled();
    },
    { timeout: 2000 },
  );
});

it('renders the Analytics route when user has Staff role', async () => {
  const { findAllByText } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <MemoryRouter initialEntries={['/analytics']}>
          <Suspense fallback="loading">
            <AuthenticatedApp />
          </Suspense>
        </MemoryRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );

  const analyticsElements = await findAllByText('Analytics');
  expect(analyticsElements.length).toBeGreaterThan(0);
});

it('renders the application layout correctly', async () => {
  const { getByText, findAllByText, getByTestId } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <MemoryRouter>
          <Suspense fallback="loading">
            <AuthenticatedApp />
          </Suspense>
        </MemoryRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  const menu = getByText('Menu');
  expect(menu).toBeInTheDocument();

  await userEvent.click(menu);

  await waitFor(() => {
    expect(getByText('Team One')).toBeInTheDocument();
    expect(getByText('Working Group One')).toBeInTheDocument();
    expect(getByText('Interest Group One')).toBeInTheDocument();
  });

  expect(getByText('CRN Logo')).toBeInTheDocument();
  expect(getByText('Shared Research')).toBeInTheDocument();
  expect(getByText('Calendar & Events')).toBeInTheDocument();
  expect(getByText('Guides & Tutorials')).toBeInTheDocument();

  const network = await findAllByText('Network');
  expect(network.length).toBeGreaterThan(0);

  const news = await findAllByText('News');
  expect(news.length).toBeGreaterThan(0);

  const about = await findAllByText('About ASAP');
  expect(about.length).toBeGreaterThan(0);

  const analyticsElements = await findAllByText('Analytics');
  expect(analyticsElements.length).toBeGreaterThan(0);

  expect(getByTestId('layout-article-testid')).toBeInTheDocument();
  expect(getByTestId('menu-header-testid')).toBeInTheDocument();
});

it('shows Projects in navigation', async () => {
  const { getByText, findAllByText } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <MemoryRouter>
          <Suspense fallback="loading">
            <AuthenticatedApp />
          </Suspense>
        </MemoryRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );

  const menu = getByText('Menu');
  await userEvent.click(menu);

  await waitFor(() => {
    expect(getByText('Projects')).toBeInTheDocument();
  });

  const projectsElements = await findAllByText('Projects');
  expect(projectsElements.length).toBeGreaterThan(0);
});

describe('User projects in navigation', () => {
  const userWithProjects = {
    ...mockedUser,
    projects: [
      {
        id: 'discovery-project-1',
        title: 'My Discovery Project',
        projectType: 'Discovery Project' as const,
        status: 'Active',
      },
      {
        id: 'resource-project-1',
        title: 'My Resource Project',
        projectType: 'Resource Project' as const,
        status: 'Active',
      },
      {
        id: 'trainee-project-1',
        title: 'My Trainee Project',
        projectType: 'Trainee Project' as const,
        status: 'Active',
      },
    ],
  };

  it('shows MY PROJECTS section with user projects', async () => {
    (useCurrentUserCRN as jest.Mock).mockReturnValue(userWithProjects);

    const { getByText } = render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <MemoryRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </MemoryRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );

    const menu = getByText('Menu');
    await userEvent.click(menu);

    await waitFor(() => {
      expect(getByText('MY PROJECTS')).toBeInTheDocument();
      expect(getByText('My Discovery Project')).toBeInTheDocument();
      expect(getByText('My Resource Project')).toBeInTheDocument();
      expect(getByText('My Trainee Project')).toBeInTheDocument();
    });
  });

  it('generates correct href for Discovery Project', async () => {
    (useCurrentUserCRN as jest.Mock).mockReturnValue(userWithProjects);

    const { getByText } = render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <MemoryRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </MemoryRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );

    const menu = getByText('Menu');
    await userEvent.click(menu);

    await waitFor(() => {
      const discoveryLink = getByText('My Discovery Project').closest('a');
      expect(discoveryLink).toHaveAttribute(
        'href',
        '/projects/discovery/discovery-project-1',
      );
    });
  });

  it('generates correct href for Resource Project', async () => {
    (useCurrentUserCRN as jest.Mock).mockReturnValue(userWithProjects);

    const { getByText } = render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <MemoryRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </MemoryRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );

    const menu = getByText('Menu');
    await userEvent.click(menu);

    await waitFor(() => {
      const resourceLink = getByText('My Resource Project').closest('a');
      expect(resourceLink).toHaveAttribute(
        'href',
        '/projects/resource/resource-project-1',
      );
    });
  });

  it('generates correct href for Trainee Project', async () => {
    (useCurrentUserCRN as jest.Mock).mockReturnValue(userWithProjects);

    const { getByText } = render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <MemoryRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </MemoryRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );

    const menu = getByText('Menu');
    await userEvent.click(menu);

    await waitFor(() => {
      const traineeLink = getByText('My Trainee Project').closest('a');
      expect(traineeLink).toHaveAttribute(
        'href',
        '/projects/trainee/trainee-project-1',
      );
    });
  });

  it('does not show MY PROJECTS section when user has no projects', async () => {
    (useCurrentUserCRN as jest.Mock).mockReturnValue({
      ...mockedUser,
      projects: [],
    });

    const { getByText, queryByText } = render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <MemoryRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </MemoryRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );

    const menu = getByText('Menu');
    await userEvent.click(menu);

    await waitFor(() => {
      expect(getByText('MY TEAMS')).toBeInTheDocument();
    });

    expect(queryByText('MY PROJECTS')).not.toBeInTheDocument();
  });
});

it('shows the loading indicator while the current user is not yet ready', async () => {
  (useCurrentUserCRN as jest.Mock).mockReturnValue(null);

  const { findByText } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <StaticRouter location="/">
          <Suspense fallback="loading">
            <AuthenticatedApp />
          </Suspense>
        </StaticRouter>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );

  expect(await findByText(/Loading\.\.\./i)).toBeInTheDocument();
});
