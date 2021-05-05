import React from 'react';
import { render } from '@testing-library/react';

import { useUserProfileContext, UserProfileContext } from '../user-profile';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { isOwnProfile } = useUserProfileContext();
  return <>isOwnProfile: {isOwnProfile ? 'true' : 'false'}</>;
};

it('passes through user profile context', () => {
  const { getByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <TestComponent />
    </UserProfileContext.Provider>,
  );
  expect(getByText('isOwnProfile: false')).toBeVisible();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <TestComponent />
    </UserProfileContext.Provider>,
  );
  expect(getByText('isOwnProfile: true')).toBeVisible();
});
