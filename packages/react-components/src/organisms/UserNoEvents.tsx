import { css } from '@emotion/react';
import { calendarIcon } from '../icons';
import { perRem } from '../pixels';
import NoEvents from './NoEvents';

const iconStyles = css({
  width: `${48 / perRem}em`,
  height: `${48 / perRem}em`,
});

const UserNoEvents: React.FC<{ past?: boolean; link: string }> = ({
  past,
  link,
}) => (
  <NoEvents>
    <span css={iconStyles}>{calendarIcon}</span>
    <NoEvents.Title>
      There aren't any {past ? ' past ' : ' upcoming '} events!
    </NoEvents.Title>
    <NoEvents.Description>
      It looks like this user will not speak at any events. In the meantime, try
      exploring other {past ? ' past ' : ' upcoming '} events on the Hub.
    </NoEvents.Description>
    <NoEvents.Link link={link}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </NoEvents.Link>
  </NoEvents>
);

export default UserNoEvents;
