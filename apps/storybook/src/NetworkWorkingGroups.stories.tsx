import { ComponentProps } from 'react';
import { NetworkWorkingGroups } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Network / Working Groups',
  component: NetworkWorkingGroups,
};
const workingGroupsProps = (): ComponentProps<typeof NetworkWorkingGroups> => {
  const numberOfItems = number('Number of Groups', 4, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    workingGroups: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `p${i}`,
      title: `My Working Group ${i + 1}`,
      shortText:
        'Working Group long Description that should be getting trimmed to 2 lines',
      description: 'Test description',
      externalLink: 'https://www.google.com',
      lastModifiedDate: '2020-01-1',
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const Normal = () => <NetworkWorkingGroups {...workingGroupsProps()} />;
