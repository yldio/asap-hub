import { ComponentProps } from 'react';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Link, Subtitle, utils } from '@asap-hub/react-components';

import { CollapsibleTable, EditableCard, IconWithLabel } from '../molecules';
import { usersIcon } from '../icons';

const { getCounterString } = utils;

type UserWorkingGroupsProps = Pick<
  gp2Model.UserResponse,
  'id' | 'firstName' | 'workingGroups'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
    isOnboarding?: boolean;
  };

const UserWorkingGroups: React.FC<UserWorkingGroupsProps> = ({
  workingGroups,
  firstName,
  subtitle,
  id,
  noLinks = false,
  isOnboarding = false,
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
      {workingGroups.length ? (
        <CollapsibleTable
          headings={
            isOnboarding ? ['Name', 'Members'] : ['Name', 'Role', 'Members']
          }
          numberOfColumns={isOnboarding ? '2' : '3'}
        >
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
            const role = getUserWorkingGroupRole(id, members) || '';
            const numberOfMembers = (
              <IconWithLabel noMargin icon={usersIcon}>
                {getCounterString(members.length, 'Member')}
              </IconWithLabel>
            );

            return {
              id: workingGroupId,
              values: isOnboarding
                ? [name, numberOfMembers]
                : [name, role, numberOfMembers],
            };
          })}
        </CollapsibleTable>
      ) : (
        <Subtitle accent={'lead'}>
          You are not associated to any working groups.
        </Subtitle>
      )}
    </EditableCard>
  );
};

export default UserWorkingGroups;
