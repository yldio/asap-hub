import { FC, Fragment, ComponentProps } from 'react';

import { ResultList, GroupCard } from '../organisms';

type NetworkWorkingGroupsProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly groups: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof GroupCard>
  >;
};

const NetworkWorkingGroups: FC<NetworkWorkingGroupsProps> = ({
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
export default NetworkWorkingGroups;
