import { createGroupResponse } from '@asap-hub/fixtures';
import { fireEvent, render } from '@testing-library/react';
import UserInterestGroupCard from '../UserInterestGroupCard';

const groups = [
  { ...createGroupResponse(), name: 'Group 1', id: 'g1' },
  { ...createGroupResponse(), name: 'Group 2', id: 'g2' },
  { ...createGroupResponse(), name: 'Group 3', id: 'g3' },
  { ...createGroupResponse(), name: 'Group 4', id: 'g4' },
  { ...createGroupResponse(), name: 'Group 5', id: 'g5' },
  { ...createGroupResponse(), name: 'Group 6', id: 'g6' },
  { ...createGroupResponse(), name: 'Group 7', id: 'g7' },
];

const displayName = 'Octavian';

it('renders correctly for a normal user', () => {
  const { getByText } = render(
    <UserInterestGroupCard displayName={displayName} groups={groups} />,
  );
  expect(getByText(`${displayName}'s Interest Groups`)).toBeVisible();
  expect(
    getByText(
      'Groups allow teams to share findings with other teams about topics of interest.',
    ),
  ).toBeVisible();

  expect(getByText(`Active Collaborations (7)`)).toBeVisible();
  expect(getByText('Past Collaborations (0)')).toBeVisible();
  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('View more interest groups')).toBeVisible();
});

it('cannot switch to the disabled tab', () => {
  const { getByRole, rerender } = render(
    <UserInterestGroupCard displayName={displayName} groups={groups} />,
  );

  expect(
    getByRole('button', { name: 'Active Collaborations (7)' }),
  ).not.toBeDisabled();
  expect(
    getByRole('button', { name: 'Past Collaborations (0)' }),
  ).toBeDisabled();

  rerender(
    <UserInterestGroupCard
      displayName={displayName}
      groups={groups}
      alumniSinceDate="2020-01-02"
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
      displayName={displayName}
      groups={groups}
      alumniSinceDate="2020-01-02"
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
    <UserInterestGroupCard displayName={displayName} groups={groups} />,
  );

  expect(getAllByText('Member')).toHaveLength(5);
  fireEvent.click(getByText('View more interest groups'), 'click');
  expect(getAllByText('Member')).toHaveLength(7);
  fireEvent.click(getByText('View less interest groups'), 'click');
  expect(getAllByText('Member')).toHaveLength(5);
});
