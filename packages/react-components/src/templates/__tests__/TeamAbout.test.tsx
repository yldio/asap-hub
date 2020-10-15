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

it('renders the contact banner', () => {
  const { getByRole } = render(
    <TeamAbout
      projectTitle="Title"
      pointOfContact="test@test.com"
      skills={[]}
      members={[]}
    />,
  );

  const link = getByRole('link');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', 'mailto:test@test.com');
});
