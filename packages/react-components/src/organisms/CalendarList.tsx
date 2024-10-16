import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';
import { FC, useState } from 'react';

import { Card, Headline3, Paragraph, Link, Button } from '../atoms';
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
  marginTop: `${33 / perRem}em`,
  marginLeft: `${24 / perRem}em`,
  marginRight: `${24 / perRem}em`,
});

const subheaderStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: `${24 / perRem}em`,
  marginLeft: `${24 / perRem}em`,
  marginRight: `${24 / perRem}em`,
  marginBottom: `${(33 - 12) / perRem}em`,
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
  margin: 0,
  paddingLeft: `${24 / perRem}em`,
  paddingRight: `${24 / perRem}em`,
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

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: `${15 / perRem}em`,
  paddingBottom: `${15 / perRem}em`,
  borderTop: `1px solid ${steel.rgb}`,
});

interface CalendarListProps {
  calendars: ReadonlyArray<BasicCalendarResponse>;
  title: string;
  description?: string;
  hideSupportText?: boolean;
}
const CalendarList: FC<CalendarListProps> = ({
  calendars,
  title,
  description,
  hideSupportText = false,
}) => {
  const truncateFrom = 5;
  const [showMore, setShowMore] = useState(false);
  const displayShowMoreButton = calendars.length > truncateFrom;

  return (
    <div css={containerStyles}>
      <Card padding={false}>
        <div css={headerStyles}>
          <Headline3 noMargin>{title}</Headline3>
        </div>
        {description && (
          <div css={subheaderStyles}>
            <Paragraph accent="lead" noMargin>
              {description}
            </Paragraph>
          </div>
        )}
        {!!calendars.length && (
          <ul
            css={[
              orderList,
              ...(!displayShowMoreButton
                ? [{ paddingBottom: `${24 / perRem}em` }]
                : []),
            ]}
          >
            {calendars
              .slice(0, showMore ? undefined : truncateFrom)
              .map(({ id, name, color }) => (
                <li key={id}>
                  <div css={dataGrid}>
                    <div css={gridText}>
                      <Paragraph accent="charcoal">
                        <span css={{ display: 'flex' }}>
                          <span
                            css={{ color, paddingRight: `${14 / perRem}em` }}
                          >
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
        {displayShowMoreButton && (
          <div css={showMoreStyles}>
            <Button linkStyle onClick={() => setShowMore(!showMore)}>
              View {showMore ? 'Less' : 'More'}
            </Button>
          </div>
        )}
      </Card>
      {!hideSupportText && (
        <Paragraph accent="lead">
          Having issues? Set up your calendar manually with these instructions
          for{' '}
          <Link href="https://support.apple.com/en-us/guide/calendar/icl1022/mac">
            Apple Calendar
          </Link>{' '}
          or{' '}
          <Link href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c">
            Outlook
          </Link>
          .
        </Paragraph>
      )}
    </div>
  );
};

export default CalendarList;
