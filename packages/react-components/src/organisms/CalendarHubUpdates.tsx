import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';
import { FC } from 'react';

import { Card, Headline3, Paragraph } from '../atoms';
import { CalendarLink } from '../molecules';
import { mobileScreen, rem } from '../pixels';

// the design strokes the card inside its bounds, so drop the CSS border to
// keep the card at the design height
const cardStyles = css({
  borderWidth: 0,
});

const containerStyles = css({
  display: 'grid',
  gridRowGap: rem(16),
  padding: rem(24),
  // Headline3 scales its line height with the viewport; the design uses 32px.
  // rem() returns em, which would scale with the heading font size here
  '& > h3': {
    lineHeight: '32px',
  },
});

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(24),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

const listStyles = css({
  display: 'grid',
  gridRowGap: rem(12),
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const description =
  'Subscribe to the official CRN calendar for community-wide sessions run by the ASAP team.';

interface CalendarHubUpdatesProps {
  calendars: ReadonlyArray<BasicCalendarResponse>;
}
const CalendarHubUpdates: FC<CalendarHubUpdatesProps> = ({ calendars }) => {
  if (!calendars.length) {
    return null;
  }

  const [firstCalendar] = calendars;

  return (
    <Card padding={false} accent="highlight" overrideStyles={cardStyles}>
      <div css={containerStyles}>
        <Headline3 noMargin>CRN Hub Updates</Headline3>
        {calendars.length === 1 && firstCalendar ? (
          <div css={rowStyles}>
            <Paragraph accent="secondary" noMargin>
              {description}
            </Paragraph>
            <CalendarLink id={firstCalendar.id} primary noMargin />
          </div>
        ) : (
          <>
            <Paragraph accent="secondary" noMargin>
              {description}
            </Paragraph>
            <ul css={listStyles}>
              {calendars.map(({ id, name }) => (
                <li key={id} css={rowStyles}>
                  <Paragraph accent="primary" noMargin>
                    {name}
                  </Paragraph>
                  <CalendarLink id={id} primary noMargin />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Card>
  );
};

export default CalendarHubUpdates;
