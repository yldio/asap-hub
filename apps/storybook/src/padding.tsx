import React from 'react';
import { DecoratorFn } from '@storybook/react';

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
