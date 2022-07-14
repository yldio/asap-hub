import { css } from '@emotion/react';
import { calendarIcon } from '../icons';
import { perRem } from '../pixels';
import NoEventsLayout from './NoEventsLayout';

const iconStyles = css({
  width: `${48 / perRem}em`,
  height: `${48 / perRem}em`,
});

const UserNoEvents: React.FC<{ past?: boolean; link: string }> = ({
  past,
  link,
}) => (
  <NoEventsLayout>
    <span css={iconStyles}>{calendarIcon}</span>
    <NoEventsLayout.Title>
      There aren't any {past ? ' past ' : ' upcoming '} events!
    </NoEventsLayout.Title>
    <NoEventsLayout.Description>
      It looks like this user will not speak at any events. In the meantime, try
      exploring other {past ? ' past ' : ' upcoming '} events on the Hub.
    </NoEventsLayout.Description>
    <NoEventsLayout.Link link={link}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </NoEventsLayout.Link>
  </NoEventsLayout>
);

export default UserNoEvents;
