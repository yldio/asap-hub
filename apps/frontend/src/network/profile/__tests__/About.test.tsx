import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import About from '../About';

it('renders the profile about section', () => {
  const { getByText } = render(
    <About userProfile={{ ...createUserResponse(), biography: 'Some Bio' }} />,
    { wrapper: StaticRouter },
  );
  expect(getByText('Some Bio')).toBeVisible();
});

it("does not allow editing somebody else's profile", () => {
  const { queryByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About userProfile={{ ...createUserResponse(), id: '1337' }} />,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', () => {
  const { getAllByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About userProfile={{ ...createUserResponse(), id: '42' }} />,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getAllByLabelText(/edit/i)).not.toHaveLength(0);
});
