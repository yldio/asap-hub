import { FC, Fragment, ComponentProps } from 'react';

import { ResultList, WorkingGroupCard } from '../organisms';

type NetworkWorkingGroupsProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly workingGroups: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof WorkingGroupCard>
  >;
};

const NetworkWorkingGroups: FC<NetworkWorkingGroupsProps> = ({
  workingGroups,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {workingGroups.map((workingGroup) => (
      <Fragment key={workingGroup.id}>
        <WorkingGroupCard {...workingGroup} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkWorkingGroups;
