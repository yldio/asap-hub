import {
  chevronDownIcon,
  chevronUpIcon,
  googleCalendarIcon,
  linkIcon,
  systemCalendarIcon,
  outlookIcon,
  outlookClassicIcon,
} from '../icons';
import { AllowedChildren } from '../text';
import DropdownButton, { ItemData } from './DropdownButton';

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
  const calResource = `calendar.google.com/calendar/ical/${encodeURIComponent(
    id,
  )}/public/basic.ics`;
  const webcal = new URL(`webcal://${calResource}`);
  const httpCal = new URL(`https://${calResource}`);
  const isWindows = /Windows/i.test(window.navigator.userAgent);

  const items: ItemData[] = [
    {
      item: <>{googleCalendarIcon} Add to Google Calendar</>,
      href: url.toString(),
    },
  ];

  if (isWindows) {
    items.push(
      {
        item: <>{outlookIcon} Add to Outlook</>,
        // this URL is terribly malformed (`webcal:https://route.to.calendar/etc`) but it's the
        // only known hack to make the browser open the app picker and that works as expected
        // when the selected app is Outlook.
        // See https://asaphub.atlassian.net/browse/ASAP-1473
        // See https://techcommunity.microsoft.com/discussions/outlookgeneral/webcal-links-not-opening-correctly-in-outlook/4462816
        href: `webcal:${httpCal}`,
      },
      {
        item: <>{outlookClassicIcon} Add to Outlook (classic)</>,
        href: webcal.toString(),
      },
    );
  }

  items.push(
    {
      item: <>{systemCalendarIcon} Add to Default System Calendar</>,
      href: webcal.toString(),
    },
    {
      item: <>{linkIcon} Copy link (Manual setup)</>,
      onClick: async (event) => {
        event.preventDefault();
        await window.navigator.clipboard.writeText(httpCal.toString());
      },
    },
  );

  return (
    <DropdownButton
      children={items}
      buttonChildren={(menuShown) => (
        <>
          <span>{children}</span>
          {menuShown ? chevronUpIcon : chevronDownIcon}
        </>
      )}
    />
  );
};

export default CalendarLink;
