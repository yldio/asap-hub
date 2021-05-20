import { css } from '@emotion/react';
import { CalendarResponse } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';
import { tabletScreen, perRem } from '../pixels';
import { CalendarLink } from '../molecules';
import { steel } from '../colors';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${24 / perRem}em`,
});

const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  margin: 0,
  li: {
    width: '100%',
    display: 'inline-flex',
  },
  '&> li + li': {
    [`@media (max-width: ${tabletScreen.min}px)`]: {
      marginTop: `${12 / perRem}em`,
    },
    borderTop: `1px solid ${steel.rgb}`,
  },
});
interface CalendarListProps {
  calendars: ReadonlyArray<CalendarResponse>;
  page: 'calendar' | 'event' | 'group';
}
const CalendarList: React.FC<CalendarListProps> = ({ calendars, page }) => (
  <div css={containerStyles}>
    <Card>
      <div css={headerStyles}>
        <Headline3>
          Subscribe to{' '}
          {page === 'group'
            ? "this group's"
            : page === 'event'
            ? "this event's"
            : 'Groups on'}{' '}
          calendar
        </Headline3>
      </div>
      {page === 'calendar' && (
        <Paragraph accent="lead">
          Below you can find a list of all the Groups that will present in the
          future. Hitting subscribe will allow you to add them to your own
          personal calendar.
        </Paragraph>
      )}
      {!!calendars.length && (
        <ul css={orderList}>
          {calendars.map(({ id, name, color }) => (
            <li key={id}>
              <div css={dataGrid}>
                <div css={gridText}>
                  <Paragraph accent="charcoal">
                    <span css={{ display: 'flex' }}>
                      <span css={{ color, paddingRight: `${14 / perRem}em` }}>
                        ●
                      </span>
                      <span css={{ fontWeight: 'bold' }}>{name}</span>
                    </span>
                  </Paragraph>
                </div>
                <div css={gridButton}>
                  <CalendarLink id={id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
    <Paragraph accent="lead">
      Having issues? Set up your calendar manually with these instructions for{' '}
      <Link href="https://support.apple.com/en-us/guide/calendar/icl1022/mac">
        Apple Calendar
      </Link>{' '}
      or{' '}
      <Link href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c">
        Outlook
      </Link>
      .
    </Paragraph>
  </div>
);

export default CalendarList;
