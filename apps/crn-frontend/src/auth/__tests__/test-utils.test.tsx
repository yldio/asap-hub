import { render, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { Auth0Provider, WhenReady } from '../test-utils';
import { useAuthorization } from '../useAuthorization';

const AuthorizationProbe: React.FC = () => {
  const getAuthorization = useAuthorization();
  const [authorization, setAuthorization] = useState('');
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAuthorization().then(setAuthorization);
  }, [getAuthorization]);
  return <span data-testid="probe">{authorization}</span>;
};

it('provides a ready Auth0 context without any RecoilRoot', async () => {
  const { getByText, getByTestId } = render(
    <Auth0Provider user={{}}>
      <WhenReady>
        <p>ready</p>
        <AuthorizationProbe />
      </WhenReady>
    </Auth0Provider>,
  );

  await waitFor(() => expect(getByText('ready')).toBeVisible());
  await waitFor(() =>
    expect(getByTestId('probe')).toHaveTextContent('Bearer access_token'),
  );
});

it('gates children behind WhenReady until the Auth0 context finishes loading', async () => {
  const { getByText, queryByText } = render(
    <Auth0Provider user={{}}>
      <WhenReady>
        <p>ready</p>
      </WhenReady>
    </Auth0Provider>,
  );

  expect(getByText('Auth0 loading...')).toBeVisible();
  await waitFor(() => expect(queryByText('ready')).toBeVisible());
});
