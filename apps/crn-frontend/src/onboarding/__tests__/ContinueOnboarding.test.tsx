import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import ContinueOnboarding from '../ContinueOnboarding';

it('renders its children once Auth0 is loaded', async () => {
  const { getByText } = render(
    <authTestUtils.UserAuth0Provider>
      <ContinueOnboarding>content</ContinueOnboarding>
    </authTestUtils.UserAuth0Provider>,
  );
  await waitFor(() => expect(getByText('content')).toBeVisible());
});
