import { css } from '@emotion/react';
import {
  CalendarLink,
  Card,
  Headline3,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { tabletScreen } from '@asap-hub/react-components/src/pixels';

const { perRem } = pixels;

const BUTTON_SPACING = 12 / perRem;
const buttons = css({
  display: 'flex',
  flexFlow: 'wrap',
  width: `calc(100% + ${BUTTON_SPACING}em)`,
  listStyle: 'none',
  margin: `${12 / perRem}em 0 0 0`,
  padding: 0,
});

const button = css({
  display: 'flex',
  marginRight: `${BUTTON_SPACING}em`,
  flexGrow: 1,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexGrow: 0,
  },
});

type EventsProps = {
  readonly calendarId: string;
};

const Events: React.FC<EventsProps> = ({ calendarId }) => (
  <Card>
    <Headline3>Events</Headline3>
    <Paragraph accent="lead">
      Subscribe this project calendar to stay always updated with the latest
      events.
    </Paragraph>
    <ul css={buttons}>
      <li css={button}>
        <CalendarLink id={calendarId}>Subscribe to Calendar</CalendarLink>
      </li>
    </ul>
  </Card>
);

export default Events;
