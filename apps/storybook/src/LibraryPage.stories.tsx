import React, { ComponentProps } from 'react';
import {
  LibraryPage,
  LibraryPageBody,
  LibraryCard,
} from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, number } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Library',
  decorators: [LayoutDecorator],
};

const researchOutput: ComponentProps<typeof LibraryCard> & { id: string } = {
  id: '1',
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

const props: () => ComponentProps<typeof LibraryPageBody> = () => {
  const outputCount = number('Output Count', 3, {
    min: 0,
  });
  return {
    researchOutput: [...Array(outputCount)].map((_, index) => ({
      ...researchOutput,
      id: index.toString(),
    })),
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
