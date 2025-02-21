import { StaticRouter } from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';

import { text, select } from './knobs';
import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Network / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select(
    'Active Tab',
    {
      Members: 'users',
      Teams: 'teams',
      'Interest Groups': 'interest-groups',
      'Working Groups': 'working-groups',
    },
    'users',
  );
  const routes = {
    users: network({}).users({}).$,
    teams: network({}).teams({}).$,
    'interest-groups': network({}).interestGroups({}).$,
    'working-groups': network({}).workingGroups({}).$,
  };
  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <NetworkPage page={activeTab} searchQuery={text('Search Query', '')}>
        Page Content
      </NetworkPage>
    </StaticRouter>
  );
};
