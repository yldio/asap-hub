import { StaticRouter } from 'react-router-dom/server';
import { NetworkPage } from '@asap-hub/react-components';
import { networkRoutes } from '@asap-hub/routing';

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
    users: networkRoutes.DEFAULT.USERS.path,
    teams: networkRoutes.DEFAULT.TEAMS.path,
    'interest-groups': networkRoutes.DEFAULT.INTEREST_GROUPS.path,
    'working-groups': networkRoutes.DEFAULT.WORKING_GROUPS.path,
  };
  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <NetworkPage page={activeTab} searchQuery={text('Search Query', '')}>
        Page Content
      </NetworkPage>
    </StaticRouter>
  );
};
