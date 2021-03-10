import React from 'react';
import { Tooltip } from '@asap-hub/react-components';
import { text, boolean } from '@storybook/addon-knobs';
import { CenterDecorator } from './layout';

export default {
  title: 'Atoms / Tooltip',
  component: Tooltip,
  decorators: [CenterDecorator],
};

export const Normal = () => (
  <>
    <Tooltip shown={boolean('Shown', true)}>
      {text('Tooltip text', 'Tooltip text')}
    </Tooltip>
    Target element
  </>
);
