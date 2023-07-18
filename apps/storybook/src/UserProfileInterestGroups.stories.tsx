import { ComponentProps } from 'react';
import { text, number } from '@storybook/addon-knobs';
import { UserProfileInterestGroups } from '@asap-hub/react-components';
import {
  createInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { InterestGroupRole } from '@asap-hub/model';

export default {
  title: 'Organisms / User Profile / Interest Groups',
};

export const Normal = () => <UserProfileInterestGroups {...props()} />;

export const GroupNameElipsed = () => (
  <UserProfileInterestGroups
    {...props(
      'A very long text to show the ellipsis working on the group name of the component',
    )}
  />
);

const props = (
  groupName: string = 'Sci 1 - GWAS Functional',
): ComponentProps<typeof UserProfileInterestGroups> => {
  const numberOfGroups = number('Number of groups', 5);
  return {
    firstName: text('First Name', 'Daniel'),
    id: '12',
    interestGroups: Array.from({ length: numberOfGroups }, (_, index) => {
      const groupResponseItem = createInterestGroupResponse({}, index);
      if (index === 0) {
        return {
          ...groupResponseItem,
          name: text('Group 0 Name', groupName),
          leaders: [
            {
              role: text('Group 0 Role', 'Lead PI') as InterestGroupRole,
              user: { ...createUserResponse(), id: '12' },
            },
          ],
        };
      }
      return groupResponseItem;
    }),
  };
};
