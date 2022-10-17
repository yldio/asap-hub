import {
  createGroupResponse,
  createListGroupResponse,
} from '@asap-hub/fixtures';
import { GroupDataObject } from '@asap-hub/model';
import { TabbedCard } from '@asap-hub/react-components';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Tabbed Card',
};

export const Normal = () => {
  const groups = createListGroupResponse(number('Number of groups', 10)).items;

  const firstTab = {
    tabTitle: text('First tab title', 'First Tab'),
    items: groups,
    createItem: (group: GroupDataObject) => (
      <div key={`group-${group.id}`}>{group.name}</div>
    ),
    truncateFrom: number('Truncate tabs from', 5),
  };

  const secondTab = {
    ...firstTab,
    tabTitle: text('Second Tab Title', 'Second Tab'),
    items: [
      {
        ...createGroupResponse(),
        name: 'Second tab group',
        id: '3',
      },
    ],
  };

  return (
    <TabbedCard
      title={text('Title', 'Tabbed Card')}
      description={text('Description', 'Description')}
      tabs={[
        firstTab,
        secondTab,
        { ...firstTab, tabTitle: text('Third tab title', 'Third Tab') },
      ]}
    />
  );
};
