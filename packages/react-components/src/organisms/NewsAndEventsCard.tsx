import React from 'react';
import css from '@emotion/css';
import { Card, Datetime, Paragraph, Headline2, TagLabel } from '../atoms';
import { perRem } from '../pixels';

const imageStyle = css({
  borderRadius: `${12 / perRem}em`,
  height: `${200 / perRem}em`,
  objectFit: 'cover',
  marginRight: `${24 / perRem}em`,
  width: `${200 / perRem}em`,
});

const containerStyle = css({
  display: 'flex',
  flexDirection: 'row',
});

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
        {thumbnail ? (
          <img
            alt={`"${title}"'s thumbnail`}
            src={thumbnail}
            css={[imageStyle]}
          />
        ) : null}
        <div>
          <TagLabel>{type}</TagLabel>
          <Headline2 styleAsHeading={4}>{title}</Headline2>
          <Paragraph accent="lead">{subtitle}</Paragraph>
          <Paragraph accent="lead" small>
            Posted: <Datetime date={new Date(created)} /> by ASAP
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default NewsAndEventsCard;
