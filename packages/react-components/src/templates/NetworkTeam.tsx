import React from 'react';
import { TeamResponse } from '../../../model/src';
import { TeamCard } from '../molecules';

interface NetworkTeamProps {
  teams: TeamResponse[];
}

const NetworkTeam: React.FC<NetworkTeamProps> = ({ teams }) => (
  <>
    {teams.map((team: TeamResponse) => {
      const { id } = team;
      return (
        <div key={id}>
          <TeamCard {...team} />
        </div>
      );
    })}
  </>
);
export default NetworkTeam;
