import React from 'react';
import { render } from '@testing-library/react';

import TeamAbout from '../TeamAbout';

it('renders the biography', () => {
  const { getByText } = render(<TeamAbout projectTitle="Title" />);
  expect(getByText(/overview/i)).toBeVisible();
  expect(getByText('Title')).toBeVisible();
});
