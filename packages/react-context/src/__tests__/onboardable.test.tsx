import { render } from '@testing-library/react';

import { useOnboardableContext } from '../onboardable';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { isOnboardable } = useOnboardableContext();
  return <>isOnboardable: {isOnboardable === null ? 'null' : 'false'}</>;
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('isOnboardable: null')).toBeVisible();
});
