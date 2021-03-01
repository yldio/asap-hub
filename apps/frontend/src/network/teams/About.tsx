import React from 'react';
import { join } from 'path';
import { TeamProfileAbout, TeamGroupsCard } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { SHARED_RESEARCH_PATH, NETWORK_PATH } from '../../routes';
import { USERS_PATH, GROUPS_PATH } from '../routes';
import { useTeamGroupsById } from './state';
import Frame from '../../structure/Frame';

const TeamGroups: React.FC<{ id: string }> = ({ id }) => {
  const { items, total } = useTeamGroupsById(id);
  return total > 0 ? (
    <TeamGroupsCard
      groups={items.map((group) => ({
        ...group,
        href: join('/', NETWORK_PATH, GROUPS_PATH, group.id),
      }))}
    />
  ) : null;
};

interface AboutProps {
  readonly team: TeamResponse;
}
const About: React.FC<AboutProps> = ({ team }) => (
  <TeamProfileAbout
    {...team}
    members={team.members.map((member) => ({
      ...member,
      href: join(NETWORK_PATH, USERS_PATH, member.id),
    }))}
    proposalHref={
      team.proposalURL && join(SHARED_RESEARCH_PATH, team.proposalURL)
    }
    teamGroupsCard={
      <Frame fallback={null}>
        <TeamGroups id={team.id} />
      </Frame>
    }
  />
);

export default About;
