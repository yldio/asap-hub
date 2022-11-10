import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { authTestUtils } from '../..';
import UserNavigation from '../UserNavigation';

describe('UserNavigation', () => {
  it('renders the text with first name', async () => {
    render(
      <authTestUtils.Auth0Provider>
        <authTestUtils.LoggedIn user={{ firstName: 'Tony' }}>
          <UserNavigation />
        </authTestUtils.LoggedIn>
      </authTestUtils.Auth0Provider>,
    );
    expect(await screen.findByText(/hi, tony/i)).toBeVisible();
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
