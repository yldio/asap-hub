import { ComponentProps, FC } from 'react';
import { EventSearch } from '.';

type EventSectionProps = ComponentProps<typeof EventSearch>;

const EventsSection: FC<EventSectionProps> = ({
  children,
  searchQuery,
  onChangeSearchQuery,
}) => (
  <article>
    <EventSearch
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
    />
    <main>{children}</main>
  </article>
);
export default EventsSection;
