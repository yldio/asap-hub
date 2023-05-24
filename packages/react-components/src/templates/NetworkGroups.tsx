import { FC, Fragment, ComponentProps } from 'react';

import { ResultList, GroupCard } from '../organisms';
import { InterestGroupsIcon } from '../icons';
import { charcoal } from '../colors';

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
  <ResultList
    icon={<InterestGroupsIcon color={charcoal.rgb} />}
    {...cardListProps}
  >
    {groups.map((group) => (
      <Fragment key={group.id}>
        <GroupCard {...group} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkGroups;
