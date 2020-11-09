import React from 'react';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import Research from '../Research';

it('renders the profile research section', () => {
  const { getByText } = render(
    <Research
      userProfile={{ ...createUserResponse(), skills: ['Some Skill'] }}
      teams={[]}
    />,
    { wrapper: StaticRouter },
  );
  expect(getByText('Some Skill')).toBeVisible();
});

it("does not allow editing somebody else's profile", () => {
  const { queryByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <Research
        userProfile={{ ...createUserResponse(), id: '1337' }}
        teams={[]}
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
      <Research
        userProfile={{ ...createUserResponse(), id: '42' }}
        teams={[]}
      />
      ,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getAllByLabelText(/edit/i)).not.toHaveLength(0);
});
