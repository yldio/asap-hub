import React, { ComponentProps } from 'react';
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import About from '../About';

it('renders the profile about section', () => {
  const { getByText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About
        userProfile={{ ...createUserResponse(), biography: 'Some Bio' }}
        onPatchUserProfile={() => {}}
      />
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getByText('Some Bio')).toBeVisible();
});

it("does not allow editing somebody else's profile", () => {
  const { queryByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About
        userProfile={{ ...createUserResponse(), id: '1337' }}
        onPatchUserProfile={() => {}}
      />
      ,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', () => {
  const { getAllByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About
        userProfile={{ ...createUserResponse(), id: '42' }}
        onPatchUserProfile={() => {}}
      />
      ,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing the biography', () => {
  const userProfile = {
    ...createUserResponse(),
    id: '42',
    biography: 'My Bio',
  };

  let handlePatchUserProfile: jest.MockedFunction<
    ComponentProps<typeof About>['onPatchUserProfile']
  >;
  let result!: RenderResult;
  beforeEach(async () => {
    handlePatchUserProfile = jest.fn();
    result = render(
      <authTestUtils.LoggedIn user={{ id: '42' }}>
        <MemoryRouter initialEntries={['/about']}>
          <Route path="/about">
            <About
              userProfile={userProfile}
              onPatchUserProfile={handlePatchUserProfile}
            />
          </Route>
        </MemoryRouter>
      </authTestUtils.LoggedIn>,
    );
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
    expect(handlePatchUserProfile).toHaveBeenLastCalledWith({
      biography: 'My Bio 2',
    });
  });
});
