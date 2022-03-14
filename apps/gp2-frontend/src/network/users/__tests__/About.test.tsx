import { FC, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { Auth0Provider } from '@asap-hub/gp2-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';

import About from '../About';
import { patchUser } from '../api';

jest.mock('../api');
const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const id = '42';
const makeWrapper =
  (userId = id, currentUserId = userId): FC<Record<string, never>> =>
  ({ children }) =>
    (
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{ id: currentUserId }}>
            <MemoryRouter
              initialEntries={[
                network({}).users({}).user({ userId }).about({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).users.template +
                  network({}).users({}).user.template +
                  network({}).users({}).user({ userId }).about.template
                }
              >
                {children}
              </Route>
            </MemoryRouter>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    );
const wrapper = makeWrapper();

it('renders the profile about section', async () => {
  const { findByText } = render(
    <About user={{ ...createUserResponse(), id, biography: 'Some Bio' }} />,
    { wrapper },
  );
  expect(await findByText('Some Bio')).toBeVisible();
});

it("does not allow editing somebody else's profile", async () => {
  const { queryByText, queryByLabelText } = render(
    <About user={{ ...createUserResponse(), id }} />,
    { wrapper: makeWrapper(id, '1337') },
  );
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', async () => {
  const { findAllByLabelText } = render(
    <About user={{ ...createUserResponse(), id }} />,
    { wrapper },
  );
  expect(await findAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing the biography', () => {
  const user = {
    ...createUserResponse(),
    id,
    biography: 'My Bio',
  };

  let result!: RenderResult;
  beforeEach(async () => {
    result = render(<About user={user} />, { wrapper });

    await result.findAllByLabelText(/edit/i);
  });

  it('opens and closes the dialog', async () => {
    const {
      getByText,
      queryByText,
      getByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = result;

    userEvent.click(getByLabelText(/edit.+bio/i));
    expect(getByDisplayValue('My Bio')).toBeVisible();

    userEvent.click(getByText(/close/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('My Bio')).not.toBeInTheDocument();
    });
  });

  it('saves the changes from the dialog', async () => {
    const {
      getByText,
      queryByText,
      getByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = result;

    userEvent.click(getByLabelText(/edit.+bio/i));
    userEvent.type(getByDisplayValue('My Bio'), ' 2');
    expect(getByDisplayValue('My Bio 2')).toBeVisible();

    userEvent.click(getByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('My Bio 2')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      { biography: 'My Bio 2' },
      expect.any(String),
    );
  });
});
