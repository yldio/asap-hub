import React from 'react';
import { TeamResponse } from '@asap-hub/model';
import { TeamCard } from '../organisms';

interface NetworkTeamProps {
  readonly teams: ReadonlyArray<
    TeamResponse & {
      readonly teamProfileHref: string;
    }
  >;
}

const NetworkTeam: React.FC<NetworkTeamProps> = ({ teams }) => (
  <>
    {teams.map((team) => {
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
