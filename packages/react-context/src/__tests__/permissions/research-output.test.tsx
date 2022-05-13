import { render } from '@testing-library/react';

import { useResearchOutputPermissionsContext } from '../../permissions/research-output';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { canCreateUpdate } = useResearchOutputPermissionsContext();
  return <>canCreateUpdate: {canCreateUpdate ? 'true' : 'false'}</>;
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('canCreateUpdate: false')).toBeVisible();
});
