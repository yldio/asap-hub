import { ComponentProps } from 'react';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Link, Subtitle, utils } from '@asap-hub/react-components';
import { css } from '@emotion/react';

import { CollapsibleTable, EditableCard, IconWithLabel } from '../molecules';
import { usersIcon } from '../icons';
import { nonMobileQuery } from '../layout';

const { getCounterString } = utils;

type UserWorkingGroupsProps = Pick<
  gp2Model.UserResponse,
  'firstName' | 'workingGroups'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
  };

const tableStyles = css({
  [nonMobileQuery]: {
    gridTemplateColumns: '3fr 1fr',
  },
});

const UserWorkingGroups: React.FC<UserWorkingGroupsProps> = ({
  workingGroups,
  firstName,
  subtitle,
  noLinks = false,
}) => (
  <EditableCard
    title="Working Groups"
    subtitle={
      subtitle ||
      `${firstName} is involved in the following GP2 working groups:`
    }
  >
    {workingGroups.length ? (
      <CollapsibleTable
        headings={['Name', 'Members']}
        tableStyles={tableStyles}
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
          const numberOfMembers = (
            <IconWithLabel noMargin icon={usersIcon}>
              {getCounterString(members.length, 'Member')}
            </IconWithLabel>
          );

          return {
            id: workingGroupId,
            values: [name, numberOfMembers],
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

export default UserWorkingGroups;
