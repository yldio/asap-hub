import { render } from '@testing-library/react';

import { useResearchOutputPermissionsContext } from '../../permissions/research-output';

const TestComponent: React.FC<{ index?: number }> = () => {
  const { permissions } = useResearchOutputPermissionsContext();
  return (
    <>
      <span>saveDraft: {permissions.saveDraft ? 'true' : 'false'}</span>
      <span>publish: {permissions.publish ? 'true' : 'false'}</span>
    </>
  );
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('saveDraft: false')).toBeVisible();
  expect(getByText('publish: false')).toBeVisible();
});
