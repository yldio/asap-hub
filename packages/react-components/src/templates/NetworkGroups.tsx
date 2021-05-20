import { FC, Fragment, ComponentProps } from 'react';

import { ResultList, GroupCard } from '../organisms';

type NetworkGroupsProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly groups: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof GroupCard>
  >;
};

const NetworkGroups: FC<NetworkGroupsProps> = ({
  groups,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {groups.map((group) => (
      <Fragment key={group.id}>
        <GroupCard {...group} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkGroups;
