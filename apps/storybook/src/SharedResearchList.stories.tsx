import { ComponentProps } from 'react';
import { SharedResearchList } from '@asap-hub/react-components';
import { boolean, number } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Shared Research / List',
};

const researchOutput: Omit<
  ComponentProps<typeof SharedResearchList>['researchOutputs'][0],
  'id'
> = {
  type: 'Proposal',
  title:
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
  created: new Date().toISOString(),
  team: {
    id: '123',
    displayName: 'A Barnes',
  },
};

const props = (): ComponentProps<typeof SharedResearchList> => {
  const numberOfItems = number('Number of Outputs', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    researchOutputs: Array.from({ length: numberOfItems }, (_, i) => ({
      ...researchOutput,
      id: `ro${i}`,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
    isListView: boolean('List View Toggled', false),
    listViewParams: '',
    cardViewParams: '',
  };
};

export const Normal = () => (
  <StaticRouter>
    <SharedResearchList {...props()} />
  </StaticRouter>
);
