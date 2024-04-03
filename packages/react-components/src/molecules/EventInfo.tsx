import { BasicEvent } from '@asap-hub/model';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { EventTime, ImageLink, LinkHeadline, TagList } from '.';
import { Headline3 } from '..';
import { neutral900 } from '../colors';
import { eventPlaceholderIcon } from '../icons';
import { largeDesktopScreen, rem } from '../pixels';

const TITLE_LIMIT = 55;

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: rem(8),

  height: rem(96),
  width: rem(96),

  overflow: 'hidden',

  [`@media (max-width: ${largeDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const contentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const tagContainerStyles = css({
  marginTop: rem(8),
  color: neutral900.rgb,
  fontSize: rem(17),
});

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const cardStyles = css({
  display: 'flex',
  flexDirection: 'row',

  gap: rem(24),
});

type EventInfoProps = ComponentProps<typeof EventTime> &
  Pick<BasicEvent, 'id' | 'title' | 'thumbnail' | 'status'> & {
    eventOwner: React.ReactNode;
    tags: string[];
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
      <div css={contentStyles}>
        {link ? (
          <LinkHeadline level={3} styleAsHeading={4} href={link} noMargin>
            {title.substring(0, titleLimit ?? undefined)}
            {titleLimit && title.length > titleLimit ? '…' : undefined}
          </LinkHeadline>
        ) : (
          <Headline3 styleAsHeading={4} noMargin>
            {title.substring(0, titleLimit ?? undefined)}
            {titleLimit && title.length > titleLimit ? '…' : undefined}
          </Headline3>
        )}
        <EventTime {...props} />
        {eventOwner}
        {eventTeams}
        {eventSpeakers}
        {tags.length > 0 && (
          <div css={tagContainerStyles}>
            <TagList tags={tags} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
