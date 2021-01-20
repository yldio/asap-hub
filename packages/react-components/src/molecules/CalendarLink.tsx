import React, { useState, useEffect, useRef } from 'react';
import css from '@emotion/css';
import { Button, Anchor } from '../atoms';
import { perRem } from '../pixels';
import {
  chevronUpIcon,
  chevronDownIcon,
  linkIcon,
  outlookIcon,
  googleCalendarIcon,
} from '../icons';
import {
  paper,
  steel,
  colorWithTransparency,
  tin,
  mint,
  lead,
  pine,
} from '../colors';
import { iCalIconImage } from '../images';

const containerStyles = css({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
});

const menuWrapperStyles = css({
  position: 'relative',
});

const menuContainerStyles = css({
  position: 'absolute',
  display: 'none',
  top: `${-6 / perRem}em`,
  right: `${-6 / perRem}em`,

  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${6 / perRem}em 0`,
});

const showMenuStyles = css({
  display: 'flex',
});

const calendarLinkListStyles = css({
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  margin: 0,
  padding: 0,

  '& li': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
});

const calendarLinkStyles = css({
  display: 'flex',
  columnGap: `${15 / perRem}rem`,
  whiteSpace: 'nowrap',
  padding: `${12 / perRem}rem ${16 / perRem}rem`,
  color: lead.rgb,

  ':hover': {
    color: pine.rgb,
    backgroundColor: mint.rgb,
  },
});

type CalendarLinkProps = {
  readonly id: string;
};

const CalendarLink: React.FC<CalendarLinkProps> = ({ id }) => {
  const reference = useRef<HTMLDivElement>(null);
  const handleClick = () => setMenuShown(!menuShown);
  const [menuShown, setMenuShown] = useState(false);
  useEffect(() => {
    setMenuShown(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference &&
        reference.current &&
        !reference?.current?.contains(event.target as Node)
      ) {
        setMenuShown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reference]);

  const url = new URL('https://calendar.google.com/calendar/r');
  url.searchParams.set('cid', id);
  const webcal = new URL(
    `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(
      id,
    )}/public/basic.ics`,
  );
  return (
    <div css={containerStyles} ref={reference}>
      <Button small onClick={handleClick}>
        Subscribe {menuShown ? chevronUpIcon : chevronDownIcon}
      </Button>
      <div css={menuWrapperStyles}>
        <div css={[menuContainerStyles, menuShown && showMenuStyles]}>
          <ul css={calendarLinkListStyles}>
            <li>
              <Anchor href={url.toString()}>
                <div css={calendarLinkStyles}>
                  {googleCalendarIcon} Add to Google Calendar
                </div>
              </Anchor>
            </li>
            <li>
              <Anchor href={webcal.toString()}>
                <div css={calendarLinkStyles}>
                  <img
                    alt="Apple Calendar Icon"
                    css={{
                      width: `${24 / perRem}em`,
                      height: `${24 / perRem}em`,
                    }}
                    src={iCalIconImage}
                  />
                  Add to iCal
                </div>
              </Anchor>
            </li>
            <li>
              <Anchor href={webcal.toString()}>
                <div css={calendarLinkStyles}>{outlookIcon} Add to Outlook</div>
              </Anchor>
            </li>
            <li>
              <Anchor
                href={webcal.toString()}
                onClick={(event) => {
                  event.preventDefault();
                  window.navigator.clipboard.writeText(webcal.toString());
                }}
              >
                <div css={calendarLinkStyles}>
                  {linkIcon}Copy link (Manual setup)
                </div>
              </Anchor>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarLink;
