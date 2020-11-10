import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { select } from '@storybook/addon-knobs';
import { MainNavigation } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Navigation / Main Nav',
  component: MainNavigation,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => {
  const path = `/${select(
    'Active Section',
    {
      Network: 'network',
      'Shared Research': 'shared-research',
      'News and Events': 'news-and-events',
      None: 'none',
    },
    'network',
  )}`;
  return (
    <StaticRouter key={path} location={path}>
      <MainNavigation
        discoverAsapHref="/discovery"
        networkHref="/network"
        sharedResearchHref="/shared-research"
        newsAndEventsHref="/news-and-events"
      />
    </StaticRouter>
  );
};
