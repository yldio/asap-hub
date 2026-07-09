import { useEffect, Suspense } from 'react';
import { compliance } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { RecoilRoot } from 'recoil';

import ManuscriptWorkspaceRedirect from '../ManuscriptWorkspaceRedirect';

const mockGetManuscriptWorkspaceUrl = jest.fn();
const mockIsEnabled = jest.fn();
const mockAuthorization = 'Bearer test-token';

jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

jest.mock('../../auth/state', () => ({
  authorizationState: jest.requireActual('recoil').atom({
    key: 'authorizationState-test',
    default: 'Bearer test-token',
  }),
}));

jest.mock('../../network/teams/api', () => ({
  ...jest.requireActual('../../network/teams/api'),
  getManuscriptWorkspaceUrl: (...args: unknown[]) =>
    mockGetManuscriptWorkspaceUrl(...args),
}));

const manuscriptId = 'manuscript-42';

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

beforeEach(() => {
  jest.clearAllMocks();
  currentLocation = null;
  mockIsEnabled.mockReturnValue(false);
});

const renderRedirect = (initialPath: string) =>
  render(
    <RecoilRoot>
      <Suspense fallback={null}>
        <MemoryRouter initialEntries={[initialPath]}>
          <LocationCapture />
          <Routes>
            <Route
              path={compliance.template + compliance({}).manuscript.template}
              element={<ManuscriptWorkspaceRedirect />}
            />
            <Route path="/target-workspace" element={<div>Workspace</div>} />
          </Routes>
        </MemoryRouter>
      </Suspense>
    </RecoilRoot>,
  );

it('redirects to the workspace url when available', async () => {
  mockGetManuscriptWorkspaceUrl.mockResolvedValue({
    url: '/target-workspace',
  });

  renderRedirect(compliance({}).manuscript({ manuscriptId }).$);

  await waitFor(() => {
    expect(currentLocation?.pathname).toBe('/target-workspace');
  });

  expect(mockGetManuscriptWorkspaceUrl).toHaveBeenCalledWith(
    manuscriptId,
    mockAuthorization,
    undefined,
    false,
  );
});

it('renders the unavailable page when there is no workspace url', async () => {
  mockGetManuscriptWorkspaceUrl.mockResolvedValue(undefined);

  renderRedirect(compliance({}).manuscript({ manuscriptId }).$);

  expect(
    await screen.findByText(/You can't access this manuscript/i),
  ).toBeVisible();
  expect(currentLocation?.pathname).toBe(
    compliance({}).manuscript({ manuscriptId }).$,
  );
});

it('passes the discussions tab when the query parameter is set', async () => {
  mockGetManuscriptWorkspaceUrl.mockResolvedValue({
    url: '/target-workspace',
  });

  renderRedirect(
    `${compliance({}).manuscript({ manuscriptId }).$}?tab=discussions`,
  );

  await waitFor(() => {
    expect(currentLocation?.pathname).toBe('/target-workspace');
  });

  expect(mockGetManuscriptWorkspaceUrl).toHaveBeenCalledWith(
    manuscriptId,
    mockAuthorization,
    'discussions',
    false,
  );
});

it('passes the PROJECT_WORKSPACE flag to the workspace url hook', async () => {
  mockIsEnabled.mockImplementation(
    (flag: string) => flag === 'PROJECT_WORKSPACE',
  );
  mockGetManuscriptWorkspaceUrl.mockResolvedValue({
    url: '/target-workspace',
  });

  renderRedirect(compliance({}).manuscript({ manuscriptId }).$);

  await waitFor(() => {
    expect(currentLocation?.pathname).toBe('/target-workspace');
  });

  expect(mockIsEnabled).toHaveBeenCalledWith('PROJECT_WORKSPACE');
  expect(mockGetManuscriptWorkspaceUrl).toHaveBeenCalledWith(
    manuscriptId,
    mockAuthorization,
    undefined,
    true,
  );
});
