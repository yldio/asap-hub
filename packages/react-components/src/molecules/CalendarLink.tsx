import { perRem } from '../pixels';
import {
  chevronUpIcon,
  chevronDownIcon,
  linkIcon,
  outlookIcon,
  googleCalendarIcon,
} from '../icons';
import { appleCalendarIconImage } from '../images';
import { TextChildren } from '../text';
import DropdownButton from './DropdownButton';

type CalendarLinkProps = {
  readonly children?: TextChildren;
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
        item: (
          <>
            <img
              alt="Apple Calendar Icon"
              css={{
                width: `${24 / perRem}em`,
                height: `${24 / perRem}em`,
              }}
              src={appleCalendarIconImage}
            />
            Add to Apple Calendar
          </>
        ),
        href: webcal.toString(),
      }}
      {{
        item: <>{outlookIcon} Add to Outlook</>,
        href: webcal.toString(),
      }}
      {{
        item: <>{linkIcon}Copy link (Manual setup)</>,
        onClick: (event) => {
          event.preventDefault();
          window.navigator.clipboard.writeText(webcal.toString());
        },
      }}
    </DropdownButton>
  );
};

export default CalendarLink;
