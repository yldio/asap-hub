import { ComponentProps, Suspense, useEffect } from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';
import { createComplianceReport, getManuscript } from '../../network/teams/api';
import ProjectComplianceReport from '../ProjectComplianceReport';
import { refreshProjectState } from '../state';

const manuscriptResponse = {
  id: 'manuscript-1',
  title: 'The Manuscript',
  versions: [{ id: 'manuscript-version-1' }],
  status: 'Addendum Required',
  notificationList: '',
};

const projectId = 'proj-1';

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

jest.mock('../../network/teams/api', () => ({
  createComplianceReport: jest
    .fn()
    .mockResolvedValue({ id: 'compliance-report-1' }),
  getManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
}));

beforeEach(() => {
  currentLocation = null;
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  (createComplianceReport as jest.Mock).mockClear();
  (getManuscript as jest.Mock).mockClear();
  (getManuscript as jest.Mock).mockResolvedValue(manuscriptResponse);
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  state?: unknown,
) => {
  const createCompliancePath = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .workspace({})
    .createComplianceReport({ manuscriptId: manuscriptResponse.id }).$;

  const workspacePath = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .workspace({}).$;

  const result = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshProjectState(projectId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: createCompliancePath,
                  state: state ?? { fromButton: true },
                },
              ]}
            >
              <LocationCapture />
              <Routes>
                <Route
                  path={`${workspacePath}/create-compliance-report/:manuscriptId`}
                  element={
                    <ManuscriptToastProvider>
                      <ProjectComplianceReport
                        projectId={projectId}
                        projectType="discovery"
                      />
                    </ManuscriptToastProvider>
                  }
                />
                <Route
                  path={`${workspacePath}/*`}
                  element={<div>Workspace</div>}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return result;
};

it('renders the compliance report form page for the manuscript', async () => {
  const { container } = await renderPage();
  expect(container).toHaveTextContent(
    'Share the compliance report associated with this manuscript.',
  );
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('redirects back to the project workspace when state.fromButton is missing', async () => {
  await renderPage({}, {});
  await waitFor(() => {
    expect(currentLocation?.pathname).toBe(
      projects({})
        .discoveryProjects({})
        .discoveryProject({ projectId })
        .workspace({}).$,
    );
  });
});
