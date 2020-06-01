import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import { Theme, ThemeVariant } from '@asap-hub/react-components';

const themeVariant = () =>
  select<ThemeVariant>(
    'Theme Variant',
    { Light: 'light', Dark: 'dark', Grey: 'grey' },
    'light',
  );
export const ThemeDecorator: DecoratorFn = (storyFn) => (
  <Theme variant={themeVariant()}>{storyFn()}</Theme>
);
