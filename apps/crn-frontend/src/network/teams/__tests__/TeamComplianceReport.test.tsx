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

import { createComplianceReport } from '../api';
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
const history = createMemoryHistory({
  initialEntries: [
    network({})
      .teams({})
      .team({ teamId })
      .workspace({})
      .createComplianceReport({ manuscriptId: manuscriptResponse.id }).$,
  ],
});

jest.mock('../../users/api');

jest.mock('../api', () => ({
  createComplianceReport: jest.fn().mockResolvedValue(complianceReportResponse),
  getManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
}));

beforeEach(() => {
  jest.resetModules();
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
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

  await renderPage();

  userEvent.type(screen.getByRole('textbox', { name: /url/i }), url);

  userEvent.type(
    screen.getByRole('textbox', {
      name: /Compliance Report Description/i,
    }),
    description,
  );

  const shareButton = screen.getByRole('button', { name: /Share/i });

  userEvent.click(shareButton);

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
