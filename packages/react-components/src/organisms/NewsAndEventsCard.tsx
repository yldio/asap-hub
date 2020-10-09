import React from 'react';
import css from '@emotion/css';
import { Card, Paragraph, Headline2, TagLabel, Caption } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { formatDate } from '../utils';
import { newsPlaceholder, eventsPlaceholder } from '../icons';

const imageStyle = css({
  objectFit: 'cover',
});

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

const containerStyle = css({
  display: 'flex',
  flexDirection: 'row',
});

const placeholders: Record<'News' | 'Event', JSX.Element> = {
  News: newsPlaceholder,
  Event: eventsPlaceholder,
};

interface NewsAndEventsCardProps {
  readonly created: Date;
  readonly type: 'News' | 'Event';
  readonly title: string;
  readonly subtitle?: string;
  readonly thumbnail?: string;
}

const NewsAndEventsCard: React.FC<NewsAndEventsCardProps> = ({
  type,
  title,
  thumbnail,
  subtitle,
  created,
}) => {
  return (
    <Card>
      <div css={containerStyle}>
        <div css={imageContainerStyle}>
          {thumbnail ? (
            <img
              alt={`"${title}"'s thumbnail`}
              src={thumbnail}
              css={[imageStyle]}
            />
          ) : (
            placeholders[type]
          )}
        </div>
        <div>
          <TagLabel>{type}</TagLabel>
          <Headline2 styleAsHeading={4}>{title}</Headline2>
          <Paragraph accent="lead">{subtitle}</Paragraph>
          <Caption accent={'lead'} asParagraph>
            Posted: {formatDate(new Date(created))} by ASAP
          </Caption>
        </div>
      </div>
    </Card>
  );
};

export default NewsAndEventsCard;
