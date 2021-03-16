import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { select } from '@storybook/addon-knobs';
import { MainNavigation } from '@asap-hub/react-components';
import { discover, network, news, sharedResearch } from '@asap-hub/routing';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Navigation / Main Nav',
  component: MainNavigation,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => {
  const path = select(
    'Active Section',
    {
      Network: network({}).teams({}).$,
      'Shared Research': sharedResearch({}).$,
      'News and Events': news({}).$,
      'Discover ASAP': discover({}).$,
      None: '/none',
    },
    'network',
  );
  return (
    <StaticRouter key={path} location={path}>
      <MainNavigation />
    </StaticRouter>
  );
};
