import React from 'react';
import { EventResponse } from '@asap-hub/model';
import format from 'date-fns/format';

import { Headline4, Link } from '../atoms';
import { ToastCard, TagList } from '../molecules';
import css from '@emotion/css';
import { perRem, smallDesktopScreen } from '../pixels';
import { groupsIcon, eventsPlaceholder } from '../icons';

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${12 / perRem}em`,
  height: `${184 / perRem}em`,
  marginRight: `${24 / perRem}em`,
  width: `${184 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const cardStyles = css({
  display: 'flex',
  flexDirection: 'row',
});

const groupsStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

type EventCardProps = Pick<EventResponse, 'startDate' | 'endDate' | 'title'> & {
  status?: 'cancelled';
  groups: (EventResponse['groups'][0] & { href: string })[];
  tags: string[];
};
const EventCard: React.FC<EventCardProps> = ({
  status,
  startDate,
  endDate,
  title,
  tags,
  groups,
}) => (
  <ToastCard
    toastText={
      status === 'cancelled' ? 'This event has been cancelled' : undefined
    }
  >
    <div css={cardStyles}>
      <div css={imageContainerStyle}>{eventsPlaceholder}</div>
      <div>
        <Headline4>{title}</Headline4>
        {format(new Date(startDate), 'E, d MMM	y').toUpperCase()} ∙{' '}
        {format(new Date(startDate), 'h:mm a')}-{' '}
        {format(new Date(endDate), 'h:mm a').toUpperCase()} (GMT)
        <span css={groupsStyles}>
          <span css={iconStyles}>{groupsIcon}</span>
          {groups.map(({ name, href }) => (
            <Link href={href}>{name}</Link>
          ))}
        </span>
        <TagList tags={tags} max={3} />
      </div>
    </div>
  </ToastCard>
);

export default EventCard;
