import { ComponentProps } from 'react';
import { NetworkTeams } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Network / Teams',
  component: NetworkTeams,
};

const teamsProps = (): ComponentProps<typeof NetworkTeams> => {
  const numberOfItems = number('Number of Teams', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    teams: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `t${i}`,
      displayName: `Barnes, A. ${i + 1}`,
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      expertiseAndResourceTags: ['Neurological Diseases'],
      labCount: number('Lab count', 15),
      members: 2,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const Normal = () => <NetworkTeams {...teamsProps()} />;
