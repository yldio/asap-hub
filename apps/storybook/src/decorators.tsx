import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { Layout } from '@asap-hub/react-components';

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

export const LayoutDecorator: DecoratorFn = (storyFn, context) =>
  NoPaddingDecorator(() => <Layout navigation>{storyFn()}</Layout>, context);
