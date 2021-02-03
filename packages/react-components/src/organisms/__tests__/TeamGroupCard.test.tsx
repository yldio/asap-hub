import React from 'react';
import { render } from '@testing-library/react';
import { createListGroupResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';

import TeamGroupTools from '../TeamGroupCard';

it('renders team group tools with 1 group', () => {
  const { getByRole, queryByRole } = render(
    <TeamGroupTools {...createListGroupResponse(1)} />,
  );
  expect(getByRole('heading', { level: 3 }).textContent).toMatchInlineSnapshot(
    `"Team Groups (1)"`,
  );
  expect(queryByRole('button')).not.toBeInTheDocument();
});

it('renders team group tools with 2 group', () => {
  const { getByRole, queryByRole } = render(
    <TeamGroupTools {...createListGroupResponse(2)} />,
  );
  expect(getByRole('heading', { level: 3 }).textContent).toMatchInlineSnapshot(
    `"Team Groups (2)"`,
  );
  expect(queryByRole('button')).not.toBeInTheDocument();
});

it('renders team group tools with 1 group and 1 team', () => {
  const { getByText } = render(
    <TeamGroupTools {...createListGroupResponse(1, { teamsCount: 1 })} />,
  );

  expect(getByText('1 Team')).toBeInTheDocument();
});
it('renders team group tools with 1 group and 2 teams', () => {
  const { getByText } = render(
    <TeamGroupTools {...createListGroupResponse(1, { teamsCount: 2 })} />,
  );
  expect(getByText('2 Teams')).toBeInTheDocument();
});
it('renders team group tools with 3 groups', () => {
  const { queryByRole } = render(
    <TeamGroupTools {...createListGroupResponse(3)} />,
  );
  expect(queryByRole('button')).toBeInTheDocument();
});

it('hides and shows expanded team list', () => {
  const { queryAllByRole, getByRole } = render(
    <TeamGroupTools {...createListGroupResponse(5)} />,
  );
  const minimisedCount = queryAllByRole('heading', { level: 4 }).length;
  userEvent.click(getByRole('button'));
  expect(minimisedCount).toBeLessThan(
    queryAllByRole('heading', { level: 4 }).length,
  );
  userEvent.click(getByRole('button'));
  expect(minimisedCount).toEqual(
    queryAllByRole('heading', { level: 4 }).length,
  );
});
