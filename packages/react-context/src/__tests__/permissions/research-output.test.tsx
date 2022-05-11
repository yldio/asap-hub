import { render } from '@testing-library/react';

import { useResearchOutputPermissionsContext } from '../../permissions/research-output';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { canCreate } = useResearchOutputPermissionsContext();
  return <>canCreate: {canCreate ? 'true' : 'false'}</>;
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('canCreate: false')).toBeVisible();
});
