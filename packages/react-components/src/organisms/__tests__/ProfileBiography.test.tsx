import React from 'react';
import { render } from '@testing-library/react';

import ProfileBiography from '../ProfileBiography';

it('renders a biography', () => {
  const { getByText, getByRole } = render(
    <ProfileBiography biography="test" />,
  );
  expect(getByText('test')).toBeVisible();
  expect(getByRole('heading').textContent).toEqual('Biography');
});

it('renders a biosketch button', () => {
  const { getByRole } = render(
    <ProfileBiography biography="test" biosketch="http://google.com" />,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://google.com');
});
