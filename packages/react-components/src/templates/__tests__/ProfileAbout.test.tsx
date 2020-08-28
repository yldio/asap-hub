import React from 'react';
import { render } from '@testing-library/react';

import ProfileAbout from '../ProfileAbout';

it('renders the biography', () => {
  const { getByText } = render(
    <ProfileAbout biography="Text content" orcidWorks={[]} />,
  );
  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});
it('does not render an empty biography', () => {
  const { queryByText } = render(<ProfileAbout orcidWorks={[]} />);
  expect(queryByText(/biography/i)).not.toBeInTheDocument();
});
