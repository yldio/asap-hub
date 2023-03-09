import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { authTestUtils } from '../..';
import UserNavigation from '../UserNavigation';

describe('UserNavigation', () => {
  const props: ComponentProps<typeof UserNavigation> = {
    menuShown: false,
    userId: '1',
    projects: [],
    workingGroups: [],
  };
  it('renders the text with first name', async () => {
    render(
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{ firstName: 'Tony' }}>
          <UserNavigation {...props} />
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>,
    );
    expect(await screen.findByText(/hi, tony/i)).toBeVisible();
  });

  it('renders a fallback instead of the display name', async () => {
    render(<UserNavigation {...props} />);
    expect(await screen.findByText(/hi, unknown/i)).toBeVisible();
  });

  it('opens user menu when clicked', () => {
    render(<UserNavigation {...props} />);

    userEvent.click(screen.getByLabelText(/toggle.+user menu/i));

    expect(screen.getByText(/Log Out/i, { selector: 'p' })).toBeVisible();
  });
});
