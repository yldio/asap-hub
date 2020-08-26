import React from 'react';
import { render } from '@testing-library/react';

import ProfileAbout from '../ProfileAbout';

it('renders the biography', () => {
  const { getByText } = render(
    <ProfileAbout biography="Text content" skills={[]} orcidWorks={[]} />,
  );
  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});
it('does not render an empty biography', () => {
  const { queryByText } = render(<ProfileAbout skills={[]} orcidWorks={[]} />);
  expect(queryByText(/biography/i)).not.toBeInTheDocument();
});

it('renders the skills', () => {
  const { getByText } = render(
    <ProfileAbout skills={['Neurological Diseases']} orcidWorks={[]} />,
  );
  expect(getByText('Expertise and Resources')).toBeVisible();
  expect(getByText('Neurological Diseases')).toBeVisible();
});
it('does not render an empty skills list', () => {
  const { queryByText } = render(<ProfileAbout skills={[]} orcidWorks={[]} />);
  expect(queryByText('Expertise and Resources')).not.toBeInTheDocument();
  expect(queryByText('Neurological Diseases')).not.toBeInTheDocument();
});
