import { render } from '@testing-library/react';
import {
  createListUserResponse,
  createListTeamResponse,
} from '@asap-hub/fixtures';

import GroupMembersSection from '../GroupMembersSection';

it('renders a list of leaders', async () => {
  const { getByText } = render(
    <GroupMembersSection
      leaders={[
        {
          user: {
            ...createListUserResponse(1).items[0],
            displayName: 'Bat Man',
            teams: [
              {
                displayName: 'One',
                id: 't0',
                role: 'Co-PI (Core Leadership)',
              },
              {
                displayName: 'Two',
                id: 't1',
                role: 'Collaborating PI',
              },
            ],
          },
          role: 'Chair',
        },
        {
          user: {
            ...createListUserResponse(2).items[1],
            displayName: 'Some One',
            teams: [
              {
                displayName: 'One',
                id: 't0',
                role: 'Co-PI (Core Leadership)',
              },
            ],
          },
          role: 'Project Manager',
        },
      ]}
      teams={[]}
    />,
  );
  expect(getByText('Bat Man').closest('li')).toHaveTextContent('Chair');
  expect(getByText('Bat Man').closest('li')).toHaveTextContent(
    'Multiple Teams',
  );
  expect(getByText('Some One').closest('li')).toHaveTextContent(
    'Project Manager',
  );
  expect(getByText('Some One').closest('li')).toHaveTextContent('One');
});

it('shows the number of teams', async () => {
  const { getByText } = render(
    <GroupMembersSection
      leaders={[]}
      teams={createListTeamResponse(1).items}
    />,
  );
  expect(getByText(/teams/i).textContent).toMatchInlineSnapshot(`"Teams (1)"`);
});
it('renders a list of teams', async () => {
  const { getByText } = render(
    <GroupMembersSection
      teams={[
        {
          ...createListTeamResponse(1).items[0],
          displayName: 'One',
          id: 't0',
        },
        {
          ...createListTeamResponse(2).items[1],
          displayName: 'Two',
          id: 't1',
        },
      ]}
      leaders={[]}
    />,
  );
  expect(getByText(/team.one/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/t0$/),
  );
  expect(getByText(/team.two/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/t1$/),
  );
});
