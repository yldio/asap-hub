import { Fragment, FC, ComponentProps } from 'react';

import { ResultList, TeamCard } from '../organisms';

type NetworkTeamsProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  readonly teams: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof TeamCard>
  >;
};

const NetworkTeams: FC<NetworkTeamsProps> = ({ teams, ...cardListProps }) => (
  <ResultList {...cardListProps}>
    {teams.map((team) => (
      <Fragment key={team.id}>
        <TeamCard {...team} displayName={team.displayName} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkTeams;
