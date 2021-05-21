import { EventsPage } from '@asap-hub/react-components';
import { select, text } from '@storybook/addon-knobs';
import { events } from '@asap-hub/routing';
import { StaticRouter } from 'react-router-dom';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Events / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select(
    'Active Tab',
    { Calendar: 'calendar', Upcoming: 'upcoming', Past: 'past' },
    'calendar',
  );
  const routes = {
    calendar: events({}).calendar({}).$,
    upcoming: events({}).upcoming({}).$,
    past: events({}).past({}).$,
  };
  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <EventsPage
        searchQuery={
          activeTab === 'calendar' ? undefined : text('Search Query', '')
        }
      >
        Page Content
      </EventsPage>
    </StaticRouter>
  );
};
