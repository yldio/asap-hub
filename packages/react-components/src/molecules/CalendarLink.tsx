import {
  chevronDownIcon,
  chevronUpIcon,
  googleCalendarIcon,
  linkIcon,
  systemCalendarIcon,
} from '../icons';
import { AllowedChildren } from '../text';
import DropdownButton from './DropdownButton';

type CalendarLinkProps = {
  readonly children?: AllowedChildren;
  readonly id: string;
};

const CalendarLink: React.FC<CalendarLinkProps> = ({
  id,
  children = 'Subscribe',
}) => {
  const url = new URL('https://calendar.google.com/calendar/r');
  url.searchParams.set('cid', id);
  const webcal = new URL(
    `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(
      id,
    )}/public/basic.ics`,
  );

  return (
    <DropdownButton
      buttonChildren={(menuShown) => (
        <>
          <span>{children}</span>
          {menuShown ? chevronUpIcon : chevronDownIcon}
        </>
      )}
    >
      {{
        item: <>{googleCalendarIcon} Add to Google Calendar</>,
        href: url.toString(),
      }}
      {{
        item: <>{systemCalendarIcon} Add to Default System Calendar</>,
        href: webcal.toString(),
      }}
      {{
        item: <>{linkIcon}Copy link (Manual setup)</>,
        onClick: async (event) => {
          event.preventDefault();
          await window.navigator.clipboard.writeText(webcal.toString());
        },
      }}
    </DropdownButton>
  );
};

export default CalendarLink;
