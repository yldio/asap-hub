import React from 'react';
import { render } from '@testing-library/react';

import UserProfileGroups from '../UserProfileGroups';

it('generates a heading', () => {
  const { getByText } = render(
    <UserProfileGroups firstName="Phillip" groups={[]} />,
  );
  expect(getByText(/philip's.groups/i).tagName).toBe('H2');
});
