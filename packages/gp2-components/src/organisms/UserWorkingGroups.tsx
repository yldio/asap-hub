import { ComponentProps } from 'react';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Link, Subtitle, utils } from '@asap-hub/react-components';

import { EditableCard, IconWithLabel } from '../molecules';
import { usersIcon } from '../icons';
import { CardTable } from '.';

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
  const getUserWorkingGroup = (
    userId: gp2Model.UserResponse['id'],
    members: gp2Model.UserWorkingGroupMember[],
  ): gp2Model.UserWorkingGroupMember[] =>
    members.filter((member) => member.userId === userId);

  return (
    <EditableCard
      title="Working Groups"
      subtitle={
        subtitle ||
        `${firstName} is involved in the following GP2 working groups:`
      }
    >
      {workingGroups.length ? (
        <CardTable
          isOnboarding={isOnboarding}
          headings={
            isOnboarding ? ['Name', 'Members'] : ['Name', 'Role', 'Members']
          }
        >
          {workingGroups
            .filter(
              (wgroup, idx) =>
                idx === workingGroups.findIndex((wg) => wg.id === wgroup.id),
            )
            .flatMap(({ title, members, id: workingGroupId }) => {
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
              const userMembership = getUserWorkingGroup(id, members);

              const numberOfMembers = (
                <IconWithLabel noMargin icon={usersIcon}>
                  {getCounterString(members.length, 'Member')}
                </IconWithLabel>
              );

              if (userMembership.length === 0) {
                return {
                  id: workingGroupId,
                  values: isOnboarding
                    ? [name, numberOfMembers]
                    : [name, '', numberOfMembers],
                };
              }
              return userMembership.map(({ role }) => ({
                id: workingGroupId,
                values: isOnboarding
                  ? [name, numberOfMembers]
                  : [name, role, numberOfMembers],
              }));
            })}
        </CardTable>
      ) : (
        <Subtitle accent={'lead'}>
          You are not associated to any working groups.
        </Subtitle>
      )}
    </EditableCard>
  );
};

export default UserWorkingGroups;
