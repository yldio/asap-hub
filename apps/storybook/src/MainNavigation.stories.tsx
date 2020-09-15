import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { select } from '@storybook/addon-knobs';
import { MainNavigation } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';

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
      Library: 'library',
      'News and Events': 'news-and-events',
      None: 'none',
    },
    'network',
  )}`;
  return (
    <StaticRouter key={path} location={path}>
      <MainNavigation
        networkHref="/network"
        libraryHref="/library"
        newsAndEventsHref="/news-and-events"
      />
    </StaticRouter>
  );
};
