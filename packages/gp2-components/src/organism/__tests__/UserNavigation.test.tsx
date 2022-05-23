import { authTestUtils } from '@asap-hub/react-components';
import { render } from '@testing-library/react';
import UserNavigation from '../UserNavigation';

describe('UserNavigation', () => {
  it('renders the text with first name', async () => {
    const { findByText } = render(
      <authTestUtils.Auth0Provider>
        <authTestUtils.LoggedIn user={{ displayName: 'John Doe' }}>
          <UserNavigation />
        </authTestUtils.LoggedIn>
      </authTestUtils.Auth0Provider>,
    );
    expect(await findByText('Hi, John')).toBeVisible();
  });
});
