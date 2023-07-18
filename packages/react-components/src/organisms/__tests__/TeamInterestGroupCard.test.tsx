import { render } from '@testing-library/react';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';

import TeamInterestGroupsCard from '../TeamInterestGroupsCard';

const createProps = (
  count: number,
  args?: Parameters<typeof createListInterestGroupResponse>[1],
) =>
  createListInterestGroupResponse(count, args).items.map((item) => ({
    ...item,
    href: '#',
  }));

it('renders team group tools with 1 group', () => {
  const { getByRole, queryByText } = render(
    <TeamInterestGroupsCard interestGroups={createProps(1)} />,
  );
  expect(getByRole('heading', { level: 3 }).textContent).toMatchInlineSnapshot(
    `"Team Groups (1)"`,
  );
  expect(queryByText(/view (more|less)/i)).not.toBeInTheDocument();
});

it('renders team group tools with 2 group', () => {
  const { getByRole, queryByRole } = render(
    <TeamInterestGroupsCard interestGroups={createProps(2)} />,
  );
  expect(getByRole('heading', { level: 3 }).textContent).toMatchInlineSnapshot(
    `"Team Groups (2)"`,
  );
  expect(queryByRole('button')).not.toBeInTheDocument();
});

it('renders team group tools with 1 group and 1 team so team is singular', () => {
  const { getByText } = render(
    <TeamInterestGroupsCard
      interestGroups={createProps(1, { teamsCount: 1 })}
    />,
  );

  expect(getByText('1 Team')).toBeInTheDocument();
});
it('renders team group tools with 1 group and 2 teams so teams is pluralized', () => {
  const { getByText } = render(
    <TeamInterestGroupsCard
      interestGroups={createProps(1, { teamsCount: 2 })}
    />,
  );
  expect(getByText('2 Teams')).toBeInTheDocument();
});
it('renders team group tools with 3 groups so view more button is visible', () => {
  const { getByText } = render(
    <TeamInterestGroupsCard interestGroups={createProps(3)} />,
  );
  expect(getByText(/more/i)).toBeVisible();
});

it('hides and shows expanded team list', () => {
  const { queryAllByRole, getByText } = render(
    <TeamInterestGroupsCard interestGroups={createProps(5)} />,
  );
  const minimisedCount = queryAllByRole('heading', { level: 4 }).length;
  userEvent.click(getByText(/more/i));
  expect(minimisedCount).toBeLessThan(
    queryAllByRole('heading', { level: 4 }).length,
  );
  userEvent.click(getByText(/less/i));
  expect(minimisedCount).toEqual(
    queryAllByRole('heading', { level: 4 }).length,
  );
});
