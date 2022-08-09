import { ComponentProps } from 'react';
import { text, number } from '@storybook/addon-knobs';
import { UserProfileGroups } from '@asap-hub/react-components';
import { createGroupResponse, createUserResponse } from '@asap-hub/fixtures';
import { GroupRole } from '@asap-hub/model';

export default {
  title: 'Organisms / User Profile / Groups',
};

export const Normal = () => <UserProfileGroups {...props()} />;

export const GroupNameElipsed = () => (
  <UserProfileGroups
    {...props(
      'A very long text to show the ellipsis working on the group name of the component',
    )}
  />
);

const props = (
  groupName: string = 'Sci 1 - GWAS Functional',
): ComponentProps<typeof UserProfileGroups> => {
  const numberOfGroups = number('Number of groups', 5);
  return {
    firstName: text('First Name', 'Daniel'),
    id: '12',
    groups: Array.from({ length: numberOfGroups }, (_, index) => {
      const groupResponseItem = createGroupResponse({}, index);
      if (index === 0) {
        return {
          ...groupResponseItem,
          name: text('Group 0 Name', groupName),
          leaders: [
            {
              role: text('Group 0 Role', 'Lead PI') as GroupRole,
              user: { ...createUserResponse(), id: '12' },
            },
          ],
        };
      }
      return groupResponseItem;
    }),
  };
};
