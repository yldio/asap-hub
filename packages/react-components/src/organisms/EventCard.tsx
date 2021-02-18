import React from 'react';
import { EventResponse } from '@asap-hub/model';
import css from '@emotion/css';

import { Headline3, Link, Anchor } from '../atoms';
import { ToastCard, TagList } from '../molecules';
import { perRem, smallDesktopScreen } from '../pixels';
import { groupsIcon, eventPlaceholderIcon, calendarIcon } from '../icons';
import { lead } from '../colors';
import { formatTimezoneToLocalTimezone } from '../utils';

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

type EventCardProps = Pick<
  EventResponse,
  'startDate' | 'endDate' | 'title' | 'tags' | 'status'
> & {
  groups: (EventResponse['groups'][0] & { href: string })[];
  href?: string;
};
const EventCard: React.FC<EventCardProps> = ({
  status,
  startDate,
  endDate,
  title,
  tags,
  groups,
  href,
}) => (
  <ToastCard
    toastText={
      status === 'Cancelled' ? 'This event has been cancelled' : undefined
    }
  >
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
            {formatTimezoneToLocalTimezone(
              startDate,
              'E, d MMM y',
            ).toUpperCase()}{' '}
            ∙{' '}
          </div>
          <div>
            {formatTimezoneToLocalTimezone(startDate, 'h:mm a')} -{' '}
            {formatTimezoneToLocalTimezone(
              endDate,
              'h:mm a (zzz)',
            ).toUpperCase()}
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
    <TagList tags={tags} max={3} />
  </ToastCard>
);

export default EventCard;
