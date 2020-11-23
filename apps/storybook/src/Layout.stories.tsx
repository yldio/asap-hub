import React from 'react';
import { Layout, createMailTo } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Layout / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout
    discoverAsapHref="/discovery"
    networkHref="/network"
    sharedResearchHref="/shared-research"
    newsAndEventsHref="/news-and-events"
    userProfileHref="/profile"
    teams={[
      { name: '1', href: '/team-1' },
      { name: '2', href: '/team-2' },
    ]}
    settingsHref="/settings"
    feedbackHref={createMailTo('test@test.science')}
    logoutHref="/layout"
    termsHref="/terms"
    privacyPolicyHref="/privacy-policy"
    aboutHref="/about"
  >
    Content
  </Layout>
);
