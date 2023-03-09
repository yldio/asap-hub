import { render } from '@testing-library/react';

import { useResearchOutputPermissionsContext } from '../../permissions/research-output';

const TestComponent: React.FC<{ index?: number }> = () => {
  const {
    canShareResearchOutput,
    canEditResearchOutput,
    canPublishResearchOutput,
  } = useResearchOutputPermissionsContext();
  return (
    <>
      <span>
        canShareResearchOutput: {canShareResearchOutput ? 'true' : 'false'}
      </span>
      <span>
        canEditResearchOutput: {canEditResearchOutput ? 'true' : 'false'}
      </span>
      <span>
        canPublishResearchOutput: {canPublishResearchOutput ? 'true' : 'false'}
      </span>
    </>
  );
};

it('passes through default profile context', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('canShareResearchOutput: false')).toBeVisible();
  expect(getByText('canEditResearchOutput: false')).toBeVisible();
  expect(getByText('canPublishResearchOutput: false')).toBeVisible();
});
