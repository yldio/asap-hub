import { render } from '@testing-library/react';

import { useUserProfileContext } from '../user-profile';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { isOwnProfile } = useUserProfileContext();
  return <>isOwnProfile: {isOwnProfile ? 'true' : 'false'}</>;
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('isOwnProfile: false')).toBeVisible();
});
