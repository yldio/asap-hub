import { TabbedCard } from '@asap-hub/react-components';

import { number, text } from './knobs';

export default {
  title: 'Molecules / Tabbed Card',
};

export const Normal = () => (
  <TabbedCard
    title={text('Title', 'Tabbed Card')}
    description={text('Description', 'Description')}
    getShowMoreText={(showMore) => `Show ${showMore ? 'Less' : 'More'}`}
    activeTabIndex={number('Selected Tab', 0, { max: 3 })}
    tabs={[
      {
        tabTitle: text('First tab title', 'First Tab'),
        items: Array.from({ length: number('Number of items', 5) }).map(
          (_, index) => ({ name: `item ${index + 1}` }),
        ),
        truncateFrom: number('Truncate tabs from', 5),
        empty: text('Empty', 'Empty'),
      },
      {
        tabTitle: text('Second tab title', 'Second Tab'),
        items: Array.from({ length: number('Number of items', 5) }).map(
          (_, index) => ({ name: `item ${index + 1}` }),
        ),
        truncateFrom: number('Truncate tabs from', 5),
        empty: text('Empty', 'Empty'),
      },
      {
        tabTitle: text('Third tab title', 'Third Tab'),
        items: Array.from({ length: number('Number of items', 5) }).map(
          (_, index) => ({ name: `item ${index + 1}` }),
        ),
        truncateFrom: number('Truncate tabs from', 5),
        empty: text('Empty', 'Empty'),
      },
    ]}
  >
    {({ data }) => (
      <ul>
        {data.map((group, index) => (
          <li key={`group-${index}`}>{group.name}</li>
        ))}
      </ul>
    )}
  </TabbedCard>
);
