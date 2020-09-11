import React from 'react';
import { render } from '@testing-library/react';

import NetworkTeam from '../NetworkTeam';

const team = {
  id: '42',
  displayName: 'Unknown Team',
  applicationNumber: 'Unknown Number',
  projectTitle: 'Unknown Project Title',
  projectSummary: 'Unknown Project Summary',
  lastModifiedDate: new Date().toISOString(),
  members: [],
  skills: [],
  teamProfileHref: 'http://localhost/teams/42',
};
const teams = [team, { ...team, id: '43', displayName: 'Unknown Team 2' }];

it('renders multiple team cards', () => {
  const { queryAllByRole } = render(<NetworkTeam teams={teams} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Unknown Team', 'Unknown Team 2']);
});
