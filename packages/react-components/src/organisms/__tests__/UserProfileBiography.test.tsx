import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import UserProfileBiography from '../UserProfileBiography';

const props: ComponentProps<typeof UserProfileBiography> = {
  biography: 'abc',
  biosketch: '',
};
it('renders a biography', () => {
  const { getByText, getByRole } = render(
    <UserProfileBiography {...props} biography="test" />,
  );
  expect(getByText('test')).toBeVisible();
  expect(getByRole('heading').textContent).toEqual('Biography');
});

it('renders a biosketch button', () => {
  const { getByRole } = render(
    <UserProfileBiography {...props} biosketch="http://google.com" />,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://google.com');
});

it('renders a placeholder for isOwnProfile true and biography omitted', () => {
  const { getByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileBiography {...props} biography="" />
    </UserProfileContext.Provider>,
  );
  expect(getByText(/your story/i)).toBeVisible();
});

it('does not render if isOwnProfile false and biography omitted', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileBiography {...props} biography="" />
    </UserProfileContext.Provider>,
  );
  expect(container).toBeEmptyDOMElement();
});
