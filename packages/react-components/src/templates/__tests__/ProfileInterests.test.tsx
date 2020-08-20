import React from 'react';
import { render } from '@testing-library/react';

import ProfileInterests from '../ProfileInterests';

it('renders research interests', () => {
  const { getByText } = render(
    <ProfileInterests
      firstName="Phillip"
      teams={[
        {
          id: '42',
          displayName: 'Phillip',
          role: 'Researcher',
          approach: '',
          responsabilities: '',
        },
      ]}
    />,
  );
  expect(getByText(/background/i)).toBeVisible();
});
