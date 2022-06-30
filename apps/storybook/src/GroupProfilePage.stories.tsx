import { GroupProfilePage } from '@asap-hub/react-components';
import { boolean, select, text } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Group Profile / Page',
  component: GroupProfilePage,
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const route = network({}).groups({}).group({ groupId: '42' });
  const activeTab = select(
    'Active Tab',
    {
      About: 'about',
      Calendar: 'calendar',
      Upcoming: 'upcoming',
      Past: 'past',
    },
    'about',
  );
  const routes = {
    about: route.about({}).$,
    calendar: route.calendar({}).$,
    upcoming: route.upcoming({}).$,
    past: route.past({}).$,
  };
  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <GroupProfilePage
        id="42"
        name="My Group"
        active={boolean('Group Active', true)}
        numberOfTeams={5}
        groupTeamsHref="#"
        lastModifiedDate="2021-01-01"
        searchQuery={
          activeTab === 'upcoming' || activeTab === 'past'
            ? text('Search Query', '')
            : undefined
        }
        pastEventsCount={2}
        upcomingEventsCount={3}
      />
    </StaticRouter>
  );
};
