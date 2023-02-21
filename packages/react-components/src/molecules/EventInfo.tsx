import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { BasicEvent } from '@asap-hub/model';
import { events } from '@asap-hub/routing';

import { neutral900 } from '../colors';
import { perRem, largeDesktopScreen, rem } from '../pixels';
import { eventPlaceholderIcon } from '../icons';
import { EventTime, TagList, LinkHeadline, ImageLink } from '.';

const TITLE_LIMIT = 55;

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${6 / perRem}em`,
  height: `${102 / perRem}em`,
  marginRight: `${24 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  width: `${102 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${largeDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const listItemStyles = css({
  padding: `${rem(7.5)} 0`,
  color: neutral900.rgb,
  whiteSpace: 'break-spaces',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: rem(17),
  display: 'flex',
});

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const cardStyles = css({
  display: 'flex',
  flexDirection: 'row',
});

const widthStyles = css({
  display: 'grid',
});

type EventInfoProps = ComponentProps<typeof EventTime> &
  Pick<BasicEvent, 'id' | 'title' | 'thumbnail' | 'status' | 'tags'> & {
    eventOwner: React.ReactNode;
    titleLimit?: number | null;
    eventSpeakers?: React.ReactNode;
    eventTeams?: React.ReactNode;
  };

const EventInfo: React.FC<EventInfoProps> = ({
  id,
  title,
  thumbnail,
  eventOwner,
  status,
  titleLimit = TITLE_LIMIT,
  eventSpeakers,
  eventTeams,
  tags,
  ...props
}) => {
  const imageComponent = thumbnail ? (
    <img alt={`Thumbnail for "${title}"`} src={thumbnail} css={imageStyle} />
  ) : (
    eventPlaceholderIcon
  );

  const link =
    status === 'Cancelled' ? undefined : events({}).event({ eventId: id }).$;

  return (
    <div css={cardStyles}>
      <div css={imageContainerStyle}>
        {link ? (
          <ImageLink link={link}>{imageComponent}</ImageLink>
        ) : (
          <>{imageComponent}</>
        )}
      </div>
      <div>
        <LinkHeadline level={3} styleAsHeading={4} href={link}>
          {title.substr(0, titleLimit ?? undefined)}
          {titleLimit && title.length > titleLimit ? '…' : undefined}
        </LinkHeadline>
        <EventTime {...props} />
        <div css={widthStyles}>
          {eventOwner}
          {eventTeams}
          {eventSpeakers}
          {tags.length > 0 && (
            <div css={listItemStyles}>
              <TagList tags={tags} max={3} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
