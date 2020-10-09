import React, { ComponentProps } from 'react';

import { TeamCard } from '../organisms';
import CardList from '../organisms/CardList';

type NetworkTeamProps = Omit<ComponentProps<typeof CardList>, 'children'> & {
  readonly teams: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof TeamCard>
  >;
};

const NetworkTeam: React.FC<NetworkTeamProps> = ({
  teams,
  ...cardListProps
}) => (
  <CardList {...cardListProps}>
    {teams.map(({ id, ...team }) => (
      <React.Fragment key={id}>
        <TeamCard {...team} />
      </React.Fragment>
    ))}
  </CardList>
);
export default NetworkTeam;
