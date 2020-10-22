import React from 'react';
import css from '@emotion/css';
import { NewsAndEventsResponse } from '@asap-hub/model';
import { Card, Paragraph, Headline2, TagLabel, Caption, Link } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { formatDate } from '../utils';
import { newsPlaceholder, eventsPlaceholder, externalLinkIcon } from '../icons';

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
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

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const cardStyle = css({
  display: 'flex',
  flexDirection: 'row',
});

const containerStyle = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const footerStyles = css({
  justifySelf: 'flex-end',
});

const placeholders: Record<'News' | 'Event', JSX.Element> = {
  News: newsPlaceholder,
  Event: eventsPlaceholder,
};

type NewsAndEventsCardProps = NewsAndEventsResponse;

const NewsAndEventsCard: React.FC<NewsAndEventsCardProps> = ({
  type,
  title,
  thumbnail,
  link,
  linkText,
  shortText,
  created,
}) => {
  return (
    <Card>
      <div css={cardStyle}>
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
        <div css={containerStyle}>
          <div css={headerStyles}>
            <TagLabel>{type}</TagLabel>
            {link ? (
              <div css={{ fontSize: `${13 / perRem}em` }}>
                <Link buttonStyle small={true} href={link}>
                  {externalLinkIcon}
                  <span css={{ fontWeight: 'normal' }}>
                    {linkText || 'Open External Link'}
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
          <Headline2 styleAsHeading={4}>{title}</Headline2>
          <div css={{ flex: 1 }}>
            <Paragraph accent="lead">{shortText}</Paragraph>
          </div>
          <div css={footerStyles}>
            <Caption accent={'lead'} asParagraph>
              Posted: {formatDate(new Date(created))} by ASAP
            </Caption>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsAndEventsCard;
