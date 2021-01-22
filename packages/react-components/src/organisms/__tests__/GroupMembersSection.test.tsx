import React from 'react';
import { render } from '@testing-library/react';
import { createListUserResponse } from '@asap-hub/fixtures';

import GroupMembersSection from '../GroupMembersSection';

it('renders a list of leaders', async () => {
  const { getByText } = render(
    <GroupMembersSection
      leaders={[
        {
          user: {
            ...createListUserResponse(1).items[0],
            displayName: 'Bat Man',
          },
          role: 'Lead PI - Chair',
        },
        {
          user: {
            ...createListUserResponse(2).items[1],
            displayName: 'Some One',
          },
          role: 'Project Manager',
        },
      ]}
      teams={[]}
    />,
  );
  expect(getByText('Bat Man').closest('li')).toHaveTextContent(
    'Lead PI - Chair',
  );
  expect(getByText('Some One').closest('li')).toHaveTextContent(
    'Project Manager',
  );
});
