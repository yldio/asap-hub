import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { Layout, BasicLayout } from '@asap-hub/react-components';

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

const centerStyles = `
  #root {
    display: grid;
    justify-content: center;
    align-content: center;
  }
`;
export const CenterDecorator: DecoratorFn = (storyFn) => (
  <div>
    <style>{centerStyles}</style>
    {storyFn()}
  </div>
);

export const BasicLayoutDecorator: DecoratorFn = (storyFn, context) =>
  NoPaddingDecorator(() => <BasicLayout>{storyFn()}</BasicLayout>, context);
export const LayoutDecorator: DecoratorFn = (storyFn, context) =>
  NoPaddingDecorator(
    () => (
      <Layout
        userProfileHref="/profile"
        teams={[
          { name: '1', href: '/team-1' },
          { name: '2', href: '/team-2' },
        ]}
        termsHref="/terms"
        privacyPolicyHref="/privacy-policy"
        aboutHref="/about"
      >
        {storyFn()}
      </Layout>
    ),
    context,
  );
