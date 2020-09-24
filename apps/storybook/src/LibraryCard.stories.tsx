import React from 'react';

import { LibraryCard } from '@asap-hub/react-components';
import { text, select, date } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Library Card',
};

export const Normal = () => (
  <LibraryCard
    title={text(
      'Title',
      'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
    )}
    type={select('Type', ['proposal'], 'proposal')}
    publishDate={new Date(
      date('Published Date', new Date(2020, 6, 12, 14, 32)),
    ).toISOString()}
    created={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
  />
);
