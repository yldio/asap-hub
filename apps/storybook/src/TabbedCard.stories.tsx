import { createListGroupResponse } from '@asap-hub/fixtures';
import { TabbedCard, UserGroupsList } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / TabbedCard',
};

const firstTab = {
  title: 'Active Collaborations',
  counter: 3,
  content: (
    <UserGroupsList
      groups={createListGroupResponse(3).items}
      id={'user-id-1'}
    />
  ),
};

const secondTab = {
  title: 'Past Collaborations',
  counter: 5,
  content: (
    <UserGroupsList
      groups={createListGroupResponse(5).items}
      id={'user-id-2'}
    />
  ),
};

export const Normal = () => (
  <TabbedCard
    title={'Groups'}
    description="Place holder description since I can't be bothered to copy"
    firstTab={firstTab}
    secondTab={secondTab}
    firstTabDisabled={boolean('Is the first tab disabled?', false)}
    secondTabDisabled={boolean('Is the second tab disabled?', false)}
  />
);
