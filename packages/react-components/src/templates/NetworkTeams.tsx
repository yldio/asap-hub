import { Fragment, FC, ComponentProps } from 'react';

import { ResultList, TeamCard } from '../organisms';
import { TeamIcon } from '../icons';
import { charcoal } from '../colors';

type NetworkTeamsProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  readonly teams: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof TeamCard>
  >;
};

const NetworkTeams: FC<NetworkTeamsProps> = ({ teams, ...cardListProps }) => (
  <ResultList icon={<TeamIcon color={charcoal.rgb} />} {...cardListProps}>
    {teams.map((team) => (
      <Fragment key={team.id}>
        <TeamCard {...team} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkTeams;
