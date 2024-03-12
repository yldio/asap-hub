import { StaticRouter } from 'react-router-dom';
import { MainNavigation } from '@asap-hub/react-components';
import {
  about,
  discover,
  network,
  news,
  sharedResearch,
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
      Network: network({}).$,
      'Shared Research': sharedResearch({}).$,
      News: news({}).$,
      'Guides & Tutorials': discover({}).$,
      'About ASAP': about({}).$,
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
