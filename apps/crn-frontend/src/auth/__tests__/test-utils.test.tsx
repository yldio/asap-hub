import { render, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';

import { auth0State } from '../state';
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

const Auth0StateProbe: React.FC = () => {
  const auth0 = useRecoilValue(auth0State);
  return <span data-testid="atom">{auth0 ? 'seeded' : 'unset'}</span>;
};

it('provides a ready Auth0 context without any RecoilRoot (migrated tests)', async () => {
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

it("seeds auth0State into the test's own RecoilRoot (un-migrated tests)", async () => {
  const { getByTestId } = render(
    <RecoilRoot>
      <Auth0Provider user={{}}>
        <WhenReady>
          <Auth0StateProbe />
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );

  await waitFor(() => expect(getByTestId('atom')).toHaveTextContent('seeded'));
});
