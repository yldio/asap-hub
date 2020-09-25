import React, { ComponentProps } from 'react';
import { LibraryPage, LibraryPageBody } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Library',
  decorators: [LayoutDecorator],
};

const props: ComponentProps<typeof LibraryPageBody> = {
  researchOutput: [
    {
      id: '1',
      type: 'proposal',
      title:
        'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
      created: new Date().toISOString(),
      team: {
        id: '123',
        displayName: 'A Barnes',
      },
      href: '#',
      teamHref: '#',
    },
    {
      id: '2',
      type: 'proposal',
      title:
        'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
      created: new Date().toISOString(),
      team: {
        id: '123',
        displayName: 'B Barnes',
      },
      href: '#',
      teamHref: '#',
    },
    {
      id: '3',
      type: 'proposal',
      title:
        'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
      created: new Date().toISOString(),
      team: {
        id: '123',
        displayName: 'C Barnes',
      },
      href: '#',
      teamHref: '#',
    },
  ],
};

export const LibraryList = () => (
  <LibraryPage
    query={text('Query', '')}
    onChangeSearch={() => action('search change')}
  >
    <LibraryPageBody {...props} />
  </LibraryPage>
);
