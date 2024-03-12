import { css } from 'emotion';
import { DecoratorFn } from '@storybook/react';
import { ThemeVariant, themes } from '@asap-hub/react-components';

import { select } from './knobs';

const themeVariant = () =>
  select<ThemeVariant>(
    'Theme Variant',
    { Light: 'light', Dark: 'dark', Grey: 'grey' },
    'light',
  );
export const ThemeDecorator: DecoratorFn = (storyFn, context) => {
  const theme = themeVariant();
  return (
    <div className={css(themes[theme])}>{storyFn({ ...context, theme })}</div>
  );
};
