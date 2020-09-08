import React from 'react';
import { DecoratorFn } from '@storybook/react';
import {
  Layout,
  ThemeVariant,
  themes,
  BasicLayout,
} from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';

const noPaddingStyles = `
body {
  padding: 0 !important;
}
`;
export const NoPaddingDecorator: DecoratorFn = (storyFn) => (
  <>
    <style>{noPaddingStyles}</style>
    {storyFn()}
  </>
);

export const BasicLayoutDecorator: DecoratorFn = (storyFn, context) =>
  NoPaddingDecorator(() => <BasicLayout>{storyFn()}</BasicLayout>, context);
export const LayoutDecorator: DecoratorFn = (storyFn, context) =>
  NoPaddingDecorator(() => <Layout>{storyFn()}</Layout>, context);

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
