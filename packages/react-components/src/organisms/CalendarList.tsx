import React from 'react';
import css from '@emotion/css';
import { CalendarResponse } from '@asap-hub/model';

import { Card, Headline3, Paragraph } from '../atoms';
import { googleCalendarIcon, plusIcon } from '../icons';
import { tabletScreen } from '../pixels';
import { ExternalLink } from '../molecules';
import { steel } from '../colors';

const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const iconHide = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

const dataGrid = css({
  display: 'inline-grid',
  width: '100%',
  gridTemplateRows: 'auto 12px auto',
  gridTemplateColumns: '1fr max-content',
  alignItems: 'center',
});
const gridText = css({
  gridColumn: '1',
  gridRow: '1 / span 2',
});
const gridButton = css({
  gridColumn: '1',
  gridRow: '2 / span 2',
  alignSelf: 'middle',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridColumn: 'auto',
    gridRow: '1 / span 2',
  },
});

const orderList = css({
  listStyle: 'none',
  paddingLeft: 0,
  marginBottom: 0,
  li: {
    width: '100%',
    display: 'inline-flex',
  },
  '& li + li': {
    borderTop: `1px solid ${steel.rgb}`,
  },
});
interface CalendarListProps {
  calendars: ReadonlyArray<CalendarResponse>;
}
const CalendarList: React.FC<CalendarListProps> = ({ calendars }) => (
  <Card>
    <div css={headerStyles}>
      <Headline3>Subscribe to Groups on Google Calendar</Headline3>
      <div css={iconHide}>{googleCalendarIcon}</div>
    </div>
    <Paragraph accent="lead">
      Below you can find a list of all the Groups that will present in the
      future. You can subscribe to each one of them by adding them to your
      Google calendar via the buttons below.
    </Paragraph>
    {calendars.length && (
      <ul css={orderList}>
        {calendars.map(({ id, name, color }) => {
          const url = new URL('https://calendar.google.com/calendar/r');
          url.searchParams.set('cid', id);
          return (
            <li key={id}>
              <div css={dataGrid}>
                <div css={gridText}>
                  <Paragraph accent="charcoal">
                    <span css={{ color, paddingRight: '1em' }}>●</span>
                    <span css={{ fontWeight: 'bold' }}>{name}</span>
                  </Paragraph>
                </div>
                <div css={gridButton}>
                  <ExternalLink
                    icon={plusIcon}
                    label="Add to calendar"
                    href={url.toString()}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </Card>
);

export default CalendarList;
