import { EventsPage } from '@asap-hub/react-components';
import { eventRoutes } from '@asap-hub/routing';
import { StaticRouter } from 'react-router-dom/server';

import { text } from './knobs';
import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Events / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = 'calendar';
  const routes = {
    calendar: eventRoutes.DEFAULT.CALENDAR.path,
    upcoming: eventRoutes.DEFAULT.UPCOMING.path,
    past: eventRoutes.DEFAULT.PAST.path,
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
