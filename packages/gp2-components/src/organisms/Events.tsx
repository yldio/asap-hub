import { css } from '@emotion/react';
import { CalendarLink, Paragraph } from '@asap-hub/react-components';

type EventsProps = {
  readonly calendarId: string;
};

const buttonStyles = css({
  width: 'fit-content',
});

const Events: React.FC<EventsProps> = ({ calendarId }) => (
  <>
    <Paragraph accent="lead">
      Subscribe this project calendar to stay always updated with the latest
      events.
    </Paragraph>
    <div css={buttonStyles}>
      <CalendarLink id={calendarId}>Subscribe to Calendar</CalendarLink>
    </div>
  </>
);

export default Events;
