import { InterestGroupRole } from '@asap-hub/model';
import {
  createInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render } from '@testing-library/react';
import UserInterestGroupCard from '../UserInterestGroupCard';

const groups = [
  { ...createInterestGroupResponse(), name: 'Group 1', id: 'g1' },
  { ...createInterestGroupResponse(), name: 'Group 2', id: 'g2' },
  { ...createInterestGroupResponse(), name: 'Group 3', id: 'g3' },
  { ...createInterestGroupResponse(), name: 'Group 4', id: 'g4' },
  { ...createInterestGroupResponse(), name: 'Group 5', id: 'g5' },
  { ...createInterestGroupResponse(), name: 'Group 6', id: 'g6' },
  { ...createInterestGroupResponse(), name: 'Group 7', id: 'g7' },
];

const userId = 'user-id';

it('renders correctly for a normal user', () => {
  const { getByText } = render(
    <UserInterestGroupCard interestGroups={groups} id={userId} />,
  );
  expect(getByText('Interest Groups')).toBeVisible();
  expect(
    getByText(
      'Interest groups allow teams to share findings with other teams about topics of interest. Find out the membership status of this member.',
    ),
  ).toBeVisible();

  expect(getByText(`Active Collaborations (7)`)).toBeVisible();
  expect(getByText('Past Collaborations (0)')).toBeVisible();
  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('View more interest groups')).toBeVisible();
});

it('cannot switch to the disabled tab', () => {
  const { getByRole, rerender } = render(
    <UserInterestGroupCard interestGroups={groups} id={userId} />,
  );

  expect(
    getByRole('button', { name: 'Active Collaborations (7)' }),
  ).not.toBeDisabled();
  expect(
    getByRole('button', { name: 'Past Collaborations (0)' }),
  ).toBeDisabled();

  rerender(
    <UserInterestGroupCard
      interestGroups={groups}
      alumniSinceDate="2020-01-02"
      id={userId}
    />,
  );
  expect(
    getByRole('button', { name: 'Active Collaborations (0)' }),
  ).toBeDisabled();
  expect(
    getByRole('button', { name: 'Past Collaborations (7)' }),
  ).not.toBeDisabled();
});

it('renders correctly for an alumni user', () => {
  const { getByText, getByRole } = render(
    <UserInterestGroupCard
      interestGroups={groups}
      alumniSinceDate="2020-01-02"
      id={userId}
    />,
  );

  expect(
    getByRole('button', { name: 'Active Collaborations (0)' }),
  ).toBeDisabled();
  expect(getByText(`Active Collaborations (0)`)).toBeVisible();
  expect(getByText(`Past Collaborations (${groups.length})`)).toBeVisible();
});

it('can click the show more/ less button', () => {
  const { getAllByText, getByText } = render(
    <UserInterestGroupCard interestGroups={groups} id={userId} />,
  );

  expect(getAllByText('Member')).toHaveLength(5);
  fireEvent.click(getByText('View more interest groups'), 'click');
  expect(getAllByText('Member')).toHaveLength(7);
  fireEvent.click(getByText('View less interest groups'), 'click');
  expect(getAllByText('Member')).toHaveLength(5);
});

it('displays the proper role for a group leader', () => {
  const interestGroups = [
    {
      ...createInterestGroupResponse(),
      leaders: [
        {
          user: {
            ...createUserResponse(),
            id: userId,
          },
          role: 'Chair' as InterestGroupRole,
          inactiveSinceDate: undefined,
        },
      ],
    },
  ];
  const { getByText } = render(
    <UserInterestGroupCard interestGroups={interestGroups} id={userId} />,
  );
  expect(getByText('Chair')).toBeInTheDocument();
});

it('renders correctly when user is inactive leader', () => {
  const interestGroups = [
    {
      ...createInterestGroupResponse(),
      leaders: [
        {
          user: {
            ...createUserResponse(),
            id: userId,
          },
          role: 'Chair' as InterestGroupRole,
          inactiveSinceDate: new Date().toISOString(),
        },
      ],
    },
  ];
  const { getByText } = render(
    <UserInterestGroupCard interestGroups={interestGroups} id={userId} />,
  );
  expect(getByText(`Active Collaborations (0)`)).toBeVisible();
  expect(getByText(`Past Collaborations (1)`)).toBeVisible();
});

it('renders correcly for inactive groups', () => {
  const interestGroups = [
    {
      ...createInterestGroupResponse(),
      active: false,
    },
  ];
  const { getByText } = render(
    <UserInterestGroupCard interestGroups={interestGroups} id={userId} />,
  );
  expect(getByText(`Active Collaborations (0)`)).toBeVisible();
  expect(getByText(`Past Collaborations (1)`)).toBeVisible();
});
