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
    const userToRender = { items: [users.items[0]!], total: 1 };
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

  describe('Pagination information', () => {
    it('renders UsersEmpty State when there are no results', () => {
      const noUsers = {
        items: [],
        total: 0,
      };
      const noUsersPageProps = {
        numberOfPages: 1,
        currentPageIndex: 0,
        renderPageHref: jest.fn(),
      };
      render(
        <UsersPageBody
          {...defaultProps}
          {...noUsersPageProps}
          users={noUsers}
        />,
      );
      expect(
        screen.queryByText('Showing 0-0 of 0 results'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'No results have been found.' }),
      ).toBeVisible();
    });

    describe('first page', () => {
      it('renders "Showing 1-10 of 20 results" when there\' is more than one page and is on the first page', () => {
        const usersList = { ...gp2Fixtures.createUsersResponse(10), total: 20 };
        const noUsersPageProps = {
          numberOfPages: 2,
          currentPageIndex: 0,
          renderPageHref: jest.fn(),
        };
        render(
          <UsersPageBody
            {...defaultProps}
            {...noUsersPageProps}
            users={usersList as unknown as gp2Model.ListUserResponse}
          />,
        );
        expect(screen.getByText('Showing 1-10 of 20 results')).toBeVisible();
      });

      it('renders "Showing 1-5 of 5 results" when the number results is smaller than the page size', () => {
        const usersList = gp2Fixtures.createUsersResponse(5);
        const noUsersPageProps = {
          numberOfPages: 1,
          currentPageIndex: 0,
          renderPageHref: jest.fn(),
        };
        render(
          <UsersPageBody
            {...defaultProps}
            {...noUsersPageProps}
            users={usersList as unknown as gp2Model.ListUserResponse}
          />,
        );
        expect(screen.getByText('Showing 1-5 of 5 results')).toBeVisible();
      });
    });

    describe('following pages', () => {
      it('renders "Showing 11-20 of 20 results" when there\' is more than one page and is on the first page', () => {
        const usersList = { ...gp2Fixtures.createUsersResponse(10), total: 20 };
        const noUsersPageProps = {
          numberOfPages: 2,
          currentPageIndex: 1,
          renderPageHref: jest.fn(),
        };
        render(
          <UsersPageBody
            {...defaultProps}
            {...noUsersPageProps}
            users={usersList as unknown as gp2Model.ListUserResponse}
          />,
        );
        expect(screen.getByText('Showing 11-20 of 20 results')).toBeVisible();
      });

      it('renders "Showing 11-15 of 15 results" when the number results is smaller than the page size', () => {
        const usersList = { ...gp2Fixtures.createUsersResponse(5), total: 15 };
        const noUsersPageProps = {
          numberOfPages: 2,
          currentPageIndex: 1,
          renderPageHref: jest.fn(),
        };
        render(
          <UsersPageBody
            {...defaultProps}
            {...noUsersPageProps}
            users={usersList as unknown as gp2Model.ListUserResponse}
          />,
        );
        expect(screen.getByText('Showing 11-15 of 15 results')).toBeVisible();
      });
    });
  });
});
