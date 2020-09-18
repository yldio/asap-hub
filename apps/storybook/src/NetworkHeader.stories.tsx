import React from 'react';
import { NetworkPageHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Network / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <NetworkPageHeader
    page={select('page', ['teams', 'users'], 'teams')}
    query={text('Query', '')}
    searchOnChange={() => action('search change')}
    toggleOnChange={() => action('toggle')}
  />
);
