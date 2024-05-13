import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createTeamResponse } from '@asap-hub/fixtures';
import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  // waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getTeam } from '../api';
import { refreshManuscriptState, refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

jest.mock('../api');

beforeEach(() => {
  jest.resetModules();
});

// const mockCreateManuscript = jest.fn() as jest.MockedFunction<
//   typeof createManuscript
// >;

// mockCreateManuscript.mockResolvedValue({ id: '1', title: 'The Manuscript' });

const renderPage = async (
  teamId: string = '42',
  teamResponse: TeamResponse = createTeamResponse(),
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
) => {
  const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
  mockGetTeam.mockImplementation(async (id) =>
    id === teamResponse.id ? teamResponse : undefined,
  );

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
        set(refreshManuscriptState('123'), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({})
                  .teams({})
                  .team({ teamId: teamId })
                  .workspace({})
                  .createManuscript({}).$,
              ]}
            >
              <Route path={path}>
                <TeamManuscript />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('displays the submit button for new manuscript', async () => {
  await renderPage();

  expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
});

// it('can publish a form when the data is valid', async () => {
//   const title = 'manuscript title';

//   await renderPage();

//   userEvent.type(
//     screen.getByRole('textbox', { name: /title of manuscript/i }),
//     title,
//   );

//   const submitButton = screen.getByRole('button', { name: /Submit/i });
//   userEvent.click(submitButton);

//   await waitFor(() => {
//     expect(submitButton).toBeEnabled();
//   });

//   // screen.debug(undefined, 400000);
//   // expect(mockCreateManuscript).toHaveBeenCalledWith('habi', expect.anything());
// });
