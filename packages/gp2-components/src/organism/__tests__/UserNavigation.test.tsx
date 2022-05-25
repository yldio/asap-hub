import { authTestUtils } from '@asap-hub/react-components';
import userEvent from '@testing-library/user-event';
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
    expect(await findByText(/hi, john/i)).toBeVisible();
  });

  it('renders a fallback instead of the display name', async () => {
    const { findByText } = render(<UserNavigation />);
    expect(await findByText(/hi, unknown/i)).toBeVisible();
  });

  it('opens user menu when clicked', async () => {
    const { getByLabelText, getByText } = render(<UserNavigation />);

    userEvent.click(getByLabelText(/toggle.+user menu/i));

    expect(getByText(/Log Out/i, { selector: 'p' })).toBeVisible();
  });
});
