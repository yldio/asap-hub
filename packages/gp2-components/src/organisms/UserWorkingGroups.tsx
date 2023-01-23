import { gp2 } from '@asap-hub/model';
import { utils } from '@asap-hub/react-components';

import { CollapsibleTable, EditableCard, IconWithLabel } from '../molecules';
import { userIcon, usersIcon } from '../icons';
import { ComponentProps } from 'react';

const { getCounterString } = utils;

type UserWorkingGroupsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'workingGroups'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'>;

const UserWorkingGroups: React.FC<UserWorkingGroupsProps> = ({
  workingGroups,
  firstName,
  subtitle,
  id,
}) => {
  const getUserWorkingGroupRole = (
    userId: gp2.UserResponse['id'],
    members: gp2.UserWorkingGroupMember[],
  ): gp2.WorkingGroupMemberRole | null =>
    members.find((member) => member.userId === userId)?.role || null;

  return (
    <EditableCard
      title="Working Groups"
      subtitle={
        subtitle
          ? subtitle
          : `${firstName} is involved in the following GP2 working groups:`
      }
    >
      <CollapsibleTable headings={['Name', 'Role', 'Nº of Members']}>
        {workingGroups.map(({ title, members }) => {
          const name = title;
          const role = (
            <IconWithLabel noMargin icon={userIcon}>
              {getUserWorkingGroupRole(id, members) || ''}
            </IconWithLabel>
          );
          const numberOfMembers = (
            <IconWithLabel noMargin icon={usersIcon}>
              {getCounterString(members.length, 'Member')}
            </IconWithLabel>
          );

          return {
            id: id,
            values: [name, role, numberOfMembers],
          };
        })}
      </CollapsibleTable>
    </EditableCard>
  );
};

export default UserWorkingGroups;
