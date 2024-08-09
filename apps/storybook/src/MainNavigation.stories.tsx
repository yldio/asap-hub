import { StaticRouter } from 'react-router-dom/server';
import { MainNavigation } from '@asap-hub/react-components';
import {
  aboutRoutes,
  discoverRoutes,
  networkRoutes,
  newsRoutes,
  sharedResearchRoutes,
} from '@asap-hub/routing';

import { select } from './knobs';
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
      Network: networkRoutes.DEFAULT.path,
      'Shared Research': sharedResearchRoutes.DEFAULT.path,
      News: newsRoutes.DEFAULT.path,
      'Guides & Tutorials': discoverRoutes.DEFAULT.path,
      'About ASAP': aboutRoutes.path,
      None: '/none',
    },
    'network',
  );
  return (
    <StaticRouter key={path} location={path}>
      <MainNavigation userOnboarded={true} />
    </StaticRouter>
  );
};

export const Disabled = () => <MainNavigation userOnboarded={false} />;
