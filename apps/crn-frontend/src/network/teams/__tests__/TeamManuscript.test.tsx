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
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createManuscript } from '../api';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';
const history = createMemoryHistory({
  initialEntries: [
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript({}).$,
  ],
});
jest.mock('../api', () => ({
  createManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
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
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript
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
                  <TeamManuscript teamId={teamId} />
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

it('renders manuscript form page', async () => {
  const { container } = await renderPage();

  expect(container).toHaveTextContent(
    'Submit your manuscript to receive a compliance report and find out which areas need to be improved before publishing your article',
  );
  expect(container).toHaveTextContent('What are you sharing');
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('can publish a form when the data is valid and navigates to team workspace', async () => {
  const title = 'The Manuscript';

  await renderPage();

  userEvent.type(
    screen.getByRole('textbox', { name: /title of manuscript/i }),
    title,
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Typeset proof');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(createManuscript).toHaveBeenCalledWith(
      {
        title,
        teamId,
        versions: [
          {
            lifecycle: 'Typeset proof',
            type: 'Original Research',
            requestingApcCoverage: 'Already submitted',
          },
        ],
      },
      expect.anything(),
    );
    expect(history.location.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });
});
