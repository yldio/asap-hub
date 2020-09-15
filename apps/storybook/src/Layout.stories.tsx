import React from 'react';
import { Layout } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Organisms / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout
    networkHref="/network"
    libraryHref="/library"
    newsAndEventsHref="/news-and-events"
    profileHref="/profile"
    teams={[
      { name: 'Team 1', href: '/team-1' },
      { name: 'Team 2', href: '/team-2' },
    ]}
    settingsHref="/settings"
    feedbackHref="/feedback"
    logoutHref="/layout"
    termsHref="/terms"
    privacyPolicyHref="/privacy-policy"
    aboutHref="/about"
  >
    Content
  </Layout>
);
