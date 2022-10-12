import { gp2 } from '@asap-hub/model';
import { PageControls } from '@asap-hub/react-components';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UsersPageBody from '../UsersPageBody';

const users: gp2.ListUserResponse = {
  items: [
    {
      id: 'u42',
      createdDate: '',
      email: '',
      displayName: 'John Doe',
      degrees: ['PhD' as const],
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: '',
      role: 'Administrator' as const,
      region: 'Europe' as const,
    },
    {
      id: 'u59',
      createdDate: '',
      email: '',
      displayName: 'Sam Smyth',
      degrees: ['PhD' as const],
      firstName: 'Sam',
      lastName: 'Smyth',
      avatarUrl: '',
      role: 'Administrator' as const,
      region: 'Africa' as const,
    },
  ],
  total: 2,
};

const pageProps: ComponentProps<typeof PageControls> = {
  currentPageIndex: 1,
  numberOfPages: 10,
  renderPageHref: (page) => `some-page`,
};

const defaultProps = {
  ...pageProps,
  users,
  onFiltersClick: jest.fn,
};

describe('UsersPageBody', () => {
  it('renders a user', () => {
    const userToRender = { items: [users.items[0]], total: 1 };
    render(<UsersPageBody {...defaultProps} users={userToRender} />);
    expect(
      screen.getByRole('heading', { name: /John Doe, PhD/i }),
    ).toBeVisible();
  });

  it('renders multiple users', () => {
    render(<UsersPageBody {...defaultProps} users={users} />);
    expect(
      screen.getByRole('heading', { name: /John Doe, PhD/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Sam Smyth, PhD/i }),
    ).toBeVisible();
  });
});
