import { crossInCircleIcon } from '../icons';
import NoEvents from './NoEvents';

const GroupNoEvents: React.FC<{ past?: boolean; link: string }> = ({
  past,
  link,
}) => (
  <NoEvents>
    {crossInCircleIcon}
    <NoEvents.Title>
      This group doesn't have any {past ? ' past ' : ' upcoming '} events!
    </NoEvents.Title>
    <NoEvents.Description>
      It looks like this group will not speak at any events. In the meantime,
      try exploring other {past ? ' past ' : ' upcoming '} events on the Hub.
    </NoEvents.Description>
    <NoEvents.Link link={link}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </NoEvents.Link>
  </NoEvents>
);

export default GroupNoEvents;
