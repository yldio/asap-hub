import React from 'react';
import { NetworkPageHeader } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Templates / Network / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <NetworkPageHeader
    page={select('page', ['teams', 'users'], 'teams')}
    query={text('Query', '')}
    onChangeSearch={() => action('search change')}
    onChangeToggle={() => action('toggle')}
  />
);
