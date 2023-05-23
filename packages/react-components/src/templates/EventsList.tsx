import { FC, ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import { ResultList, EventCard } from '../organisms';
import AlgoliaHit from '../atoms/AlgoliaHit';
import { EventIcon } from '../icons';
import { charcoal } from '../colors';

const containerStyles = css({
  paddingTop: rem(36),
  display: 'grid',
  gridRowGap: rem(36),
});

type EventsListProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  events: ComponentProps<typeof EventCard>[];
} & Pick<ComponentProps<typeof AlgoliaHit>, 'algoliaQueryId'>;

const EventsListPage: FC<EventsListProps> = ({
  events,
  algoliaQueryId,
  ...props
}) => (
  <div css={containerStyles}>
    <ResultList icon={<EventIcon color={charcoal.rgb} />} {...props}>
      {events.map(({ ...event }, index) => (
        <AlgoliaHit
          key={event.id}
          algoliaQueryId={algoliaQueryId}
          objectId={event.id}
          index={index}
        >
          <EventCard {...event} />
        </AlgoliaHit>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
