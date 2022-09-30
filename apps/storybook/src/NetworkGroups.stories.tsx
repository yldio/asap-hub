import { ComponentProps } from 'react';
import { NetworkGroups } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Network / Groups',
  component: NetworkGroups,
};

const groupsProps = (): ComponentProps<typeof NetworkGroups> => {
  const numberOfItems = number('Number of Groups', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    groups: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `p${i}`,
      name: `My Group ${i + 1}`,
      description: 'Group Description',
      tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6'],
      numberOfTeams: 3,
      active: true,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const Normal = () => <NetworkGroups {...groupsProps()} />;
