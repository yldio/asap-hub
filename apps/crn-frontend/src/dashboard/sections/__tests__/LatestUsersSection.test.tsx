import { createListUserResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import LatestUsersSection from '../LatestUsersSection';
import { useUsers } from '../../../network/users/state';

jest.mock('../../../network/users/state');

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

afterEach(() => {
  jest.clearAllMocks();
});

it('renders the latest users section', () => {
  mockUseUsers.mockReturnValue(
    createListUserResponse(2) as ReturnType<typeof useUsers>,
  );
  render(<LatestUsersSection />);
  expect(screen.getByText('Latest Users')).toBeVisible();
});

it('shows a View All link to the users page', () => {
  mockUseUsers.mockReturnValue(
    createListUserResponse(0) as ReturnType<typeof useUsers>,
  );
  render(<LatestUsersSection />);
  expect(screen.getByText('View All →', { selector: 'a' })).toHaveAttribute(
    'href',
    '/network/users',
  );
});
