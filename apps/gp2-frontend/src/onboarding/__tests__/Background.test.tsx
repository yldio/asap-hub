import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { Keyword } from '@asap-hub/model/build/gp2';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser, patchUser } from '../../users/api';
import { refreshUserState } from '../../users/state';
import Background from '../Background';

jest.mock('../../users/api');

mockConsoleError();

const renderBackground = async (id: string) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ onboarded: false, id }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.onboarding({}).background({}).$]}
            >
              <Route path={gp2Routing.onboarding({}).background.template}>
                <Background />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
describe('Background', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

  it('renders biography and keywords', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderBackground(user.id);
    expect(screen.getByRole('heading', { name: 'Biography' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderBackground('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('saves the biography modal', async () => {
    const biography = 'this is some biography';
    const user = { ...gp2Fixtures.createUserResponse(), biography };
    mockGetUser.mockResolvedValueOnce(user);
    await renderBackground(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, biographyEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(biographyEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ biography }),
      expect.anything(),
    );
  });

  it('saves the keywords modal', async () => {
    const keywords = ['Genetics'] as Keyword[];
    const user = { ...gp2Fixtures.createUserResponse(), keywords };
    mockGetUser.mockResolvedValueOnce(user);
    await renderBackground(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [keywordsEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(keywordsEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ keywords }),
      expect.anything(),
    );
  });
});
