import { GroupProfileAbout } from '@asap-hub/react-components';
import React from 'react';
import { GroupResponse } from '@asap-hub/model';
import { join } from 'path';

import { NETWORK_PATH } from '../../routes';
import { USERS_PATH, TEAMS_PATH } from '../routes';

interface AboutProps {
  group: GroupResponse;
  groupTeamsElementId: string;
}
const About: React.FC<AboutProps> = ({ group, groupTeamsElementId }) => (
  <GroupProfileAbout
    {...group}
    leaders={group.leaders.map(({ user, role }) => ({
      role,
      href: join(NETWORK_PATH, USERS_PATH, user.id),
      user: {
        ...user,
        teams: user.teams.map((team) => ({
          ...team,
          href: join(NETWORK_PATH, TEAMS_PATH, team.id),
        })),
      },
    }))}
    teams={group.teams.map((team) => ({
      ...team,
      href: join(NETWORK_PATH, TEAMS_PATH, team.id),
    }))}
    membersSectionId={groupTeamsElementId}
  />
);

export default About;
