import { css } from '@emotion/react';
import { Anchor } from '../atoms';
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

const calendarLinkStyles = css({
  display: 'flex',
  columnGap: `${15 / perRem}rem`,
  fontWeight: 'normal',
});

const resetButtonStyles = css({
  padding: 0,
  margin: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  color: 'inherit',

  ':focus': {
    outline: 'none',
    boxShadow: 'none',
  },
});

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
      <Anchor href={url.toString()}>
        <div css={calendarLinkStyles}>
          {googleCalendarIcon} Add to Google Calendar
        </div>
      </Anchor>

      <Anchor href={webcal.toString()}>
        <div css={calendarLinkStyles}>
          <img
            alt="Apple Calendar Icon"
            css={{
              width: `${24 / perRem}em`,
              height: `${24 / perRem}em`,
            }}
            src={appleCalendarIconImage}
          />
          Add to Apple Calendar
        </div>
      </Anchor>

      <Anchor href={webcal.toString()}>
        <div css={calendarLinkStyles}>{outlookIcon} Add to Outlook</div>
      </Anchor>

      <button
        css={resetButtonStyles}
        onClick={(event) => {
          event.preventDefault();
          window.navigator.clipboard.writeText(webcal.toString());
        }}
      >
        <span css={calendarLinkStyles}>{linkIcon}Copy link (Manual setup)</span>
      </button>
    </DropdownButton>
  );
};

export default CalendarLink;
