import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
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
import { getTags } from '../../shared/api';
import Background from '../Background';

jest.mock('../../users/api');
jest.mock('../../shared/api');

mockConsoleError();

const renderBackground = async (id: string) => {
  render(
    <RecoilRoot>
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
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetTags.mockResolvedValue(gp2Fixtures.createTagsResponse());
  });

  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;

  it('renders biography and tags', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderBackground(user.id);
    expect(screen.getByRole('heading', { name: 'Biography' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeVisible();
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
    userEvent.click(biographyEditButton!);
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

  it('saves the tags modal', async () => {
    const tags = [{ id: '1', name: 'Genetics' }] as gp2Model.TagDataObject[];
    const user = { ...gp2Fixtures.createUserResponse(), tags };
    mockGetUser.mockResolvedValueOnce(user);
    await renderBackground(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [tagsEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(tagsEditButton!);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ tags: tags.map(({ id }) => ({ id })) }),
      expect.anything(),
    );
  });
});
