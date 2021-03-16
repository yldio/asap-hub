import React, { ComponentProps } from 'react';

import { ResultList, GroupCard } from '../organisms';

type NetworkGroupsProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly groups: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof GroupCard>
  >;
};

const NetworkGroups: React.FC<NetworkGroupsProps> = ({
  groups,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {groups.map((group) => (
      <React.Fragment key={group.id}>
        <GroupCard {...group} />
      </React.Fragment>
    ))}
  </ResultList>
);
export default NetworkGroups;
