import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Analytics from '../Analytics';
import { getMemberships } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetMemberships = getMemberships as jest.MockedFunction<
  typeof getMemberships
>;

const data = [
  {
    id: '1',
    displayName: 'Team 1',
    workingGroupLeadershipRoleCount: 1,
    workingGroupPreviousLeadershipRoleCount: 2,
    workingGroupMemberCount: 3,
    workingGroupPreviousMemberCount: 4,
    interestGroupLeadershipRoleCount: 5,
    interestGroupPreviousLeadershipRoleCount: 6,
    interestGroupMemberCount: 7,
    interestGroupPreviousMemberCount: 8,
  },
  {
    id: '2',
    displayName: 'Team 2',
    workingGroupLeadershipRoleCount: 2,
    workingGroupPreviousLeadershipRoleCount: 3,
    workingGroupMemberCount: 4,
    workingGroupPreviousMemberCount: 5,
    interestGroupLeadershipRoleCount: 4,
    interestGroupPreviousLeadershipRoleCount: 3,
    interestGroupMemberCount: 2,
    interestGroupPreviousMemberCount: 1,
  },
];

const renderPage = async () => {
  render(<Analytics />);
};

it('renders with working group data', async () => {
  mockGetMemberships.mockReturnValue(data);

  await renderPage();
  expect(
    screen.getAllByText('Working Group Leadership & Membership').length,
  ).toBe(2);
});

it('renders with interest group data', async () => {
  mockGetMemberships.mockReturnValue(data);
  const label = 'Interest Group Leadership & Membership';

  await renderPage();
  const input = screen.getByRole('textbox', { hidden: false });

  userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(2);
});
