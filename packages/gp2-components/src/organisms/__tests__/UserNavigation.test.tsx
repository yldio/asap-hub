import { authTestUtils } from '@asap-hub/react-components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserNavigation from '../UserNavigation';

describe('UserNavigation', () => {
  it('renders the text with first name', async () => {
    render(
      <authTestUtils.Auth0ProviderCRN>
        <authTestUtils.LoggedInCRN user={{ displayName: 'John Doe' }}>
          <UserNavigation />
        </authTestUtils.LoggedInCRN>
      </authTestUtils.Auth0ProviderCRN>,
    );
    expect(await screen.findByText(/hi, john/i)).toBeVisible();
  });

  it('renders a fallback instead of the display name', async () => {
    render(<UserNavigation />);
    expect(await screen.findByText(/hi, unknown/i)).toBeVisible();
  });

  it('opens user menu when clicked', () => {
    render(<UserNavigation />);

    userEvent.click(screen.getByLabelText(/toggle.+user menu/i));

    expect(screen.getByText(/Log Out/i, { selector: 'p' })).toBeVisible();
  });
});
