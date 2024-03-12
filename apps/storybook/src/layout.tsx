import { Decorator } from '@storybook/react';
import { Layout, BasicLayout, MessageLayout } from '@asap-hub/react-components';

const noPaddingStyles = `
  body {
    padding: 0 !important;
  }
`;
export const NoPaddingDecorator: Decorator = (storyFn) => (
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
export const CenterDecorator: Decorator = (storyFn) => (
  <div>
    <style>{centerStyles}</style>
    {storyFn()}
  </div>
);

export const BasicLayoutDecorator: Decorator = (storyFn, context) =>
  NoPaddingDecorator(() => <BasicLayout>{storyFn()}</BasicLayout>, context);
export const LayoutDecorator: Decorator = (storyFn, context) =>
  NoPaddingDecorator(
    () => (
      <Layout
        userOnboarded={true}
        userProfileHref="/profile"
        teams={[
          { name: '1', href: '/team-1' },
          { name: '2', href: '/team-2' },
        ]}
        aboutHref="/about"
        workingGroups={[
          { name: 'wg 1', href: '/working-group-1', active: true },
          { name: 'wg 2', href: '/working-group-2', active: false },
        ]}
        interestGroups={[
          { name: 'ig 1', href: '/interest-group-1', active: true },
          { name: 'ig 2', href: '/interest-group-2', active: false },
        ]}
      >
        {storyFn()}
      </Layout>
    ),
    context,
  );
export const MessageLayoutDecorator: Decorator = (storyFn, context) =>
  NoPaddingDecorator(
    () => (
      <MessageLayout appOrigin={window.location.origin}>
        {storyFn()}
      </MessageLayout>
    ),
    context,
  );
