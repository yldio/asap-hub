import React from 'react';
import { render } from '@testing-library/react';

import TeamAbout from '../TeamAbout';

it('renders the overview', () => {
  const { getByText } = render(
    <TeamAbout projectTitle="Title" skills={[]} members={[]} />,
  );

  expect(getByText(/overview/i)).toBeVisible();
  expect(getByText('Title')).toBeVisible();
});
