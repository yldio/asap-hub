import { ComponentProps } from 'react';

import EventsPageHeader from './EventsPageHeader';
import PageContraints from './PageConstraints';

type EventsPageProps = ComponentProps<typeof EventsPageHeader>;

const EventsPage: React.FC<EventsPageProps> = ({ children, ...props }) => (
  <article>
    <EventsPageHeader {...props} />
    <PageContraints>{children}</PageContraints>
  </article>
);

export default EventsPage;
