import React from 'react';
import { render } from '@testing-library/react';

import Welcome from '../Welcome';

it('renders the welcome template with name and link', () => {
  const { getByRole } = render(
    <Welcome firstName="John Doe" link="https://example.com" />,
  );

  const heading = getByRole('heading');
  expect(heading.textContent).toContain('John Doe');
});
