import React from 'react';
import { EventsPage, EventsCalendar } from '@asap-hub/react-components';
import Frame from '../structure/Frame';
import { useCalendars } from './state';

const Events: React.FC<Record<string, never>> = () => {
  const { items } = useCalendars();
  return (
    <EventsPage>
      <Frame>
        <EventsCalendar calendars={items} />
      </Frame>
    </EventsPage>
  );
};

export default Events;
