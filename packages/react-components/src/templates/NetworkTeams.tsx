import React, { ComponentProps } from 'react';

import { ResultList, TeamCard } from '../organisms';

type NetworkTeamsProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  readonly teams: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof TeamCard>
  >;
};

const NetworkTeams: React.FC<NetworkTeamsProps> = ({
  teams,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {teams.map(({ id, ...team }) => (
      <React.Fragment key={id}>
        <TeamCard {...team} />
      </React.Fragment>
    ))}
  </ResultList>
);
export default NetworkTeams;
