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
      displayName: 'Tony Stark',
      degrees: ['PhD' as const],
      firstName: 'Tony',
      lastName: 'Stark',
      avatarUrl: '',
      role: 'Administrator' as const,
      region: 'Europe' as const,
      country: 'Spain',
      positions: [
        {
          role: 'CEO',
          department: 'Research',
          institution: 'Stark Industries',
        },
      ],
    },
    {
      id: 'u59',
      createdDate: '',
      email: '',
      displayName: 'Peter Parker',
      degrees: ['BSc' as const],
      firstName: 'Peter',
      lastName: 'Parket',
      avatarUrl: '',
      role: 'Administrator' as const,
      region: 'North America' as const,
      country: 'Canada',
      positions: [
        {
          role: 'Photographer',
          department: 'Newsroom',
          institution: 'Daily Bugle',
        },
      ],
    },
  ],
  total: 2,
};
const pageProps: ComponentProps<typeof PageControls> = {
  currentPageIndex: 1,
  numberOfPages: 10,
  renderPageHref: (page) => `some-page`,
};

describe('UsersPageBody', () => {
  it('renders a user', () => {
    const userToRender = { items: [users.items[0]], total: 1 };
    render(<UsersPageBody users={userToRender} {...pageProps} />);
    expect(
      screen.getByRole('heading', { name: /Tony Stark, PhD/i }),
    ).toBeVisible();
  });

  it('renders multiple users', () => {
    render(<UsersPageBody users={users} {...pageProps} />);
    expect(
      screen.getByRole('heading', { name: /Tony Stark, PhD/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Peter Parker, BSc/i }),
    ).toBeVisible();
  });
});
