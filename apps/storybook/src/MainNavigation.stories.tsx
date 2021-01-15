import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { select } from '@storybook/addon-knobs';
import { MainNavigation } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Organisms / Navigation / Main Nav',
  component: MainNavigation,
  decorators: [
    NoPaddingDecorator,
    makeFlagDecorator('Enable Events Page', 'EVENTS_PAGE'),
  ],
};

export const Normal = () => {
  const path = `/${select(
    'Active Section',
    {
      Network: 'network',
      'Shared Research': 'shared-research',
      'News and Events': 'news-and-events',
      'Discover ASAP': 'discover',
      None: 'none',
    },
    'network',
  )}`;
  return (
    <StaticRouter key={path} location={path}>
      <MainNavigation
        discoverAsapHref="/discover"
        networkHref="/network"
        sharedResearchHref="/shared-research"
        newsAndEventsHref="/news-and-events"
        eventsHref="/events"
      />
    </StaticRouter>
  );
};
