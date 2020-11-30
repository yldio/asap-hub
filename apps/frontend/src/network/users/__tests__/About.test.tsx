import React from 'react';
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';

import { Auth0Provider } from '@asap-hub/frontend/src/auth/test-utils';
import About from '../About';
import { patchUser } from '../api';

jest.mock('../api');

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const wrapper: React.FC<{}> = ({ children }) => (
  <RecoilRoot>
    <React.Suspense fallback="loading">
      <Auth0Provider user={{ id: '42' }}>
        <StaticRouter>{children}</StaticRouter>
      </Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

it('renders the profile about section', async () => {
  const { findByText } = render(
    <About user={{ ...createUserResponse(), biography: 'Some Bio' }} />,
    { wrapper },
  );
  expect(await findByText('Some Bio')).toBeVisible();
});

it("does not allow editing somebody else's profile", async () => {
  const { queryByText, queryByLabelText } = render(
    <Auth0Provider user={{ id: '42' }}>
      <About user={{ ...createUserResponse(), id: '1337' }} />
    </Auth0Provider>,
    { wrapper },
  );
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', async () => {
  const { findAllByLabelText } = render(
    <Auth0Provider user={{ id: '42' }}>
      <About user={{ ...createUserResponse(), id: '42' }} />
    </Auth0Provider>,
    { wrapper },
  );
  expect(await findAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing the biography', () => {
  const user = {
    ...createUserResponse(),
    id: '42',
    biography: 'My Bio',
  };

  let result!: RenderResult;
  beforeEach(async () => {
    result = render(
      <Auth0Provider user={{ id: '42' }}>
        <MemoryRouter initialEntries={['/about']}>
          <Route path="/about">
            <About user={user} />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

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
    await userEvent.type(getByDisplayValue('My Bio'), ' 2');
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
