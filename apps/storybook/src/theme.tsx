import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { ThemeVariant, themes } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';

const themeVariant = () =>
  select<ThemeVariant>(
    'Theme Variant',
    { Light: 'light', Dark: 'dark', Grey: 'grey' },
    'light',
  );
const themeStyles = (theme: ThemeVariant) => `
body {
  ${themes[theme]}
}
`;
export const ThemeDecorator: DecoratorFn = (storyFn, context) => {
  const theme = themeVariant();
  return (
    <>
      <style>{themeStyles(theme)}</style>
      {storyFn({ ...context, theme })}
    </>
  );
};
