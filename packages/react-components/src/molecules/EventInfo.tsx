import React from 'react';
import { EventResponse } from '@asap-hub/model';
import css from '@emotion/css';

import { Headline3, Link, Anchor } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { groupsIcon, eventPlaceholderIcon, calendarIcon } from '../icons';
import { lead } from '../colors';
import { formatDateToLocalTimezone } from '../date';

const TITLE_LIMIT = 55;

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${12 / perRem}em`,
  height: `${102 / perRem}em`,
  marginRight: `${24 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  width: `${102 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const cardStyles = css({
  display: 'flex',
  flexDirection: 'row',
});

const dateStyles = css({
  color: lead.rgb,
  display: 'flex',
  flexWrap: 'wrap',
  whiteSpace: 'pre',
});

const groupsStyles = css({
  display: 'grid',
  listStyle: 'none',
  margin: 0,
  padding: `${12 / perRem}em 0`,
  gridRowGap: `${12 / perRem}em`,

  color: lead.rgb,
});
const asapEventStyles = css({
  padding: `${12 / perRem}em 0`,

  color: lead.rgb,
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

type EventInfoProps = Pick<EventResponse, 'startDate' | 'endDate' | 'title'> & {
  groups: (EventResponse['groups'][0] & { href: string })[];
  href?: string;
};

const EventInfo: React.FC<EventInfoProps> = ({
  startDate,
  endDate,
  title,
  groups,
  href,
}) => (
  <div css={cardStyles}>
    <div css={imageContainerStyle}>{eventPlaceholderIcon}</div>
    <div
      css={{
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      <Anchor href={href}>
        <Headline3 styleAsHeading={4}>
          {title.substr(0, TITLE_LIMIT)}
          {title.length > TITLE_LIMIT ? '…' : undefined}
        </Headline3>
      </Anchor>
      <div css={dateStyles}>
        <div>
          {formatDateToLocalTimezone(startDate, 'E, d MMM y').toUpperCase()} ∙{' '}
        </div>
        <div>
          {formatDateToLocalTimezone(startDate, 'h:mm a')} -{' '}
          {formatDateToLocalTimezone(endDate, 'h:mm a (z)').toUpperCase()}
        </div>
      </div>
      {groups.length ? (
        <ul css={groupsStyles}>
          {groups.map(({ name, href: groupHref, id }) => (
            <li key={id}>
              <Link href={groupHref}>
                <span css={iconStyles}>{groupsIcon}</span>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div css={asapEventStyles}>
          <span css={iconStyles}>{calendarIcon}</span>ASAP Event
        </div>
      )}
    </div>
  </div>
);

export default EventInfo;
