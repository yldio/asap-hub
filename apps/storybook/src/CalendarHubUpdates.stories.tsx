import { CalendarHubUpdates } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Organisms / Calendar Hub Updates',
  component: CalendarHubUpdates,
};

export const Normal = () => (
  <CalendarHubUpdates
    calendars={[
      {
        color: '#B1365F',
        id: 'hub@asap.science',
        name: text('Calendar Name', 'ASAP Hub'),
      },
    ]}
  />
);

export const MultipleCalendars = () => (
  <CalendarHubUpdates
    calendars={[
      { color: '#B1365F', id: 'hub@asap.science', name: 'ASAP Hub' },
      { color: '#5C1158', id: 'other@asap.science', name: 'ASAP Other' },
    ]}
  />
);
