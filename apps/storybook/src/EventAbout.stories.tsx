import { addHours, subHours } from 'date-fns';
import { EventAbout } from '@asap-hub/react-components';
import { text, array } from './knobs';

export default {
  title: 'Organisms / Events / About',
  component: EventAbout,
};

export const Normal = () => (
  <EventAbout
    description={text('Description', 'Event Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    endDate={addHours(new Date(), 1).toISOString()}
  />
);

export const AfterEvent = () => (
  <EventAbout
    description={text('Description', 'Event Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    endDate={subHours(new Date(), 1).toISOString()}
  />
);
