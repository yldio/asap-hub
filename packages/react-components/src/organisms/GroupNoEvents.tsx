import { crossInCircleIcon } from '../icons';
import NoEventsLayout from './NoEventsLayout';

const GroupNoEvents: React.FC<{ past?: boolean; link: string }> = ({
  past,
  link,
}) => (
  <NoEventsLayout>
    {crossInCircleIcon}
    <NoEventsLayout.Title>
      This group doesn't have any {past ? ' past ' : ' upcoming '} events!
    </NoEventsLayout.Title>
    <NoEventsLayout.Description>
      It looks like this group will not speak at any events. In the meantime,
      try exploring other {past ? ' past ' : ' upcoming '} events on the Hub.
    </NoEventsLayout.Description>
    <NoEventsLayout.Link link={link}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </NoEventsLayout.Link>
  </NoEventsLayout>
);

export default GroupNoEvents;
