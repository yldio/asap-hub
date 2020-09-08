import React from 'react';
import { render } from '@testing-library/react';

import NetworkTeam from '../NetworkTeam';
import { TeamResponse } from '../../../../model/src';

const team: TeamResponse = {
  id: '42',
  displayName: 'Unknown Team',
  applicationNumber: 'Unknown Number',
  projectTitle: 'Unknown Project Title',
  projectSummary: 'Unknown Project Summary',
  lastModifiedDate: new Date().toISOString(),
  members: [],
  skills: [],
};
const teams: ReadonlyArray<TeamResponse> = [
  team,
  { ...team, id: '43', displayName: 'Unknown Team 2' },
];

it('renders multiple team cards', () => {
  const { queryAllByRole } = render(<NetworkTeam teams={teams} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Unknown Team', 'Unknown Team 2']);
});
