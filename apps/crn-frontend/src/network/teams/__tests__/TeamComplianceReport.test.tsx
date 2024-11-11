import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createComplianceReport, getManuscript } from '../api';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamComplianceReport from '../TeamComplianceReport';

const manuscriptResponse = {
  id: 'manuscript-1',
  title: 'The Manuscript',
  versions: [{ id: 'manuscript-version-1' }],
};
const complianceReportResponse = { id: 'compliance-report-1' };

const teamId = '42';

jest.mock('../api', () => ({
  createComplianceReport: jest.fn().mockResolvedValue(complianceReportResponse),
  getManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
}));

const mockGetManuscript = getManuscript as jest.MockedFunction<
  typeof getManuscript
>;

beforeEach(() => {
  jest.resetModules();
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  history = createMemoryHistory({
    initialEntries: [
      network({})
        .teams({})
        .team({ teamId })
        .workspace({})
        .createComplianceReport({ manuscriptId: manuscriptResponse.id }).$,
    ],
  }),
) => {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).workspace.template +
    network({}).teams({}).team({ teamId }).workspace({}).createComplianceReport
      .template;

  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <Router history={history}>
              <Route path={path}>
                <ManuscriptToastProvider>
                  <TeamComplianceReport teamId={teamId} />
                </ManuscriptToastProvider>
              </Route>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('renders compliance report form page', async () => {
  const { container } = await renderPage();

  expect(container).toHaveTextContent(
    'Share the compliance report associated with this manuscript.',
  );
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('can publish a form when the data is valid and navigates to team workspace', async () => {
  const url = 'https://compliancereport.com';
  const description = 'compliance report description';
  const history = createMemoryHistory({
    initialEntries: [
      network({})
        .teams({})
        .team({ teamId })
        .workspace({})
        .createComplianceReport({ manuscriptId: manuscriptResponse.id }).$,
    ],
  });

  await renderPage({}, history);

  userEvent.type(screen.getByRole('textbox', { name: /url/i }), url);

  userEvent.type(
    screen.getByRole('textbox', {
      name: /Compliance Report Description/i,
    }),
    description,
  );

  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled());

  userEvent.click(shareButton);

  const confirmButton = screen.getByRole('button', {
    name: /Share Compliance Report/i,
  });
  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(createComplianceReport).toHaveBeenCalledWith(
      {
        url,
        description,
        manuscriptVersionId: manuscriptResponse.versions[0]!.id,
      },
      expect.anything(),
    );
    expect(history.location.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });
});

it('renders not found when the manuscript hook does not return a manuscript with a version', async () => {
  mockGetManuscript.mockResolvedValue(undefined);
  await renderPage();

  expect(screen.getByRole('heading').textContent).toContain(
    'Sorry! We can’t seem to find that page.',
  );
});
