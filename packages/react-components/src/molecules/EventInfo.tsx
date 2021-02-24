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
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
  color: lead.rgb,
});

const iconStyles = css({
  display: 'inline-block',
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
      <span css={groupsStyles}>
        <span css={iconStyles}>
          {groups.length ? groupsIcon : calendarIcon}
        </span>
        {groups.length
          ? groups.map(({ name, href: groupHref, id }) => (
              <div css={{ whiteSpace: 'pre' }} key={`group-${id}`}>
                <Link href={groupHref}>{name}</Link>{' '}
              </div>
            ))
          : 'ASAP Event'}
      </span>
    </div>
  </div>
);

export default EventInfo;
