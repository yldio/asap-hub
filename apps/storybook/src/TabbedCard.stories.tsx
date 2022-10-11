import {
  createGroupResponse,
  createListGroupResponse,
} from '@asap-hub/fixtures';
import { GroupDataObject } from '@asap-hub/model';
import { TabbedCard } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Tabbed Card',
};

const groups = createListGroupResponse(number('Number of groups', 10)).items;

const firstTab = {
  tabTitle: `First Tab`,
  items: groups,
  createItem: (group: GroupDataObject) => (
    <li key={`group-${group.id}`}>{group.name}</li>
  ),
  truncateFrom: 2,
};

const secondTab = {
  ...firstTab,
  tabTitle: `Second Tab`,
  items: [
    {
      ...createGroupResponse(),
      name: 'Second tab group',
      id: '3',
    },
  ],
};

export const Normal = () => (
  <TabbedCard
    title="Tabbed card"
    description="description"
    tabs={[firstTab, secondTab, { ...firstTab, tabTitle: 'Third Tab' }]}
  />
);
