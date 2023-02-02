import { ComponentProps } from 'react';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Link, utils } from '@asap-hub/react-components';

import { CollapsibleTable, EditableCard, IconWithLabel } from '../molecules';
import { userIcon, usersIcon } from '../icons';

const { getCounterString } = utils;

type UserWorkingGroupsProps = Pick<
  gp2Model.UserResponse,
  'id' | 'firstName' | 'workingGroups'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
  };

const UserWorkingGroups: React.FC<UserWorkingGroupsProps> = ({
  workingGroups,
  firstName,
  subtitle,
  id,
  noLinks = false,
}) => {
  const getUserWorkingGroupRole = (
    userId: gp2Model.UserResponse['id'],
    members: gp2Model.UserWorkingGroupMember[],
  ): gp2Model.WorkingGroupMemberRole | null =>
    members.find((member) => member.userId === userId)?.role || null;

  return (
    <EditableCard
      title="Working Groups"
      subtitle={
        subtitle ||
        `${firstName} is involved in the following GP2 working groups:`
      }
    >
      <CollapsibleTable headings={['Name', 'Role', 'Nº of Members']}>
        {workingGroups.map(({ title, members, id: workingGroupId }) => {
          const name = noLinks ? (
            title
          ) : (
            <Link
              underlined
              href={
                gp2Routing.workingGroups({}).workingGroup({
                  workingGroupId,
                }).$
              }
            >
              {title}
            </Link>
          );
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
            id: workingGroupId,
            values: [name, role, numberOfMembers],
          };
        })}
      </CollapsibleTable>
    </EditableCard>
  );
};

export default UserWorkingGroups;
