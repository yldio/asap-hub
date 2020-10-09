import React, { ComponentProps } from 'react';
import { LibraryPage, LibraryPageBody } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, number } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Library',
  decorators: [LayoutDecorator],
};

const researchOutput: Omit<
  ComponentProps<typeof LibraryPageBody>['researchOutputs'][0],
  'id'
> = {
  type: 'proposal',
  title:
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
  created: new Date().toISOString(),
  team: {
    id: '123',
    displayName: 'A Barnes',
    href: '#',
  },
  href: '#',
};

const props = (): ComponentProps<typeof LibraryPageBody> => {
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
  };
};

export const LibraryList = () => (
  <LibraryPage
    query={text('Query', '')}
    onChangeSearch={() => action('search change')}
  >
    <LibraryPageBody {...props()} />
  </LibraryPage>
);
