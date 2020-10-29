import React from 'react';
import { render } from '@testing-library/react';
import { createTeamResponse } from '@asap-hub/fixtures';

import TeamWorkspace from '../TeamWorkspace';

it('renders a coming soon text', () => {
  const team = createTeamResponse({ teamMembers: 1, tools: 0 });

  const { getByRole } = render(<TeamWorkspace {...team} />);

  expect(getByRole('heading').textContent).toEqual('Team Collaboration Tools');
});
