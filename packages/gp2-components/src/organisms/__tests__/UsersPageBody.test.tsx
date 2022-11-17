import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { PageControls } from '@asap-hub/react-components';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UsersPageBody from '../UsersPageBody';

const users: gp2Model.ListUserResponse = {
  items: [
    gp2Fixtures.createUserResponse({
      id: 'u42',
      displayName: 'Tony Stark',
      degrees: ['PhD' as const],
    }),
    gp2Fixtures.createUserResponse({
      id: 'u59',
      displayName: 'Peter Parker',
      degrees: ['BSc'],
    }),
  ],
  total: 2,
};

const pageProps: ComponentProps<typeof PageControls> = {
  currentPageIndex: 1,
  numberOfPages: 10,
  renderPageHref: jest.fn(),
};

const defaultProps = {
  ...pageProps,
  users,
  isAdministrator: false,
  searchQuery: '',
  onFiltersClick: jest.fn,
  onExportClick: jest.fn,
  onSearchQueryChange: jest.fn,
};

describe('UsersPageBody', () => {
  it('renders a user', () => {
    const userToRender = { items: [users.items[0]], total: 1 };
    render(<UsersPageBody {...defaultProps} users={userToRender} />);
    expect(
      screen.getByRole('heading', { name: /Tony Stark, PhD/i }),
    ).toBeVisible();
  });

  it('renders multiple users', () => {
    render(<UsersPageBody {...defaultProps} users={users} />);
    expect(
      screen.getByRole('heading', { name: /Tony Stark, PhD/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Peter Parker, BSc/i }),
    ).toBeVisible();
  });
});
