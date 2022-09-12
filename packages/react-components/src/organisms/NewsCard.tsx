import { css } from '@emotion/react';
import { NewsResponse, NewsType } from '@asap-hub/model';
import { news } from '@asap-hub/routing';

import { Card, Paragraph, Headline4, Pill } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { formatDate } from '../date';
import { newsPlaceholder, trainingPlaceholderIcon } from '../icons';
import { ExternalLink, LinkHeadline, ImageLink } from '../molecules';
import { lead } from '..';
import { captionStyles } from '../text';

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${6 / perRem}em`,
  height: `${184 / perRem}em`,
  marginTop: `${9 / perRem}em`,
  marginBottom: `${3 / perRem}em`,

  marginRight: `${24 / perRem}em`,
  width: `${184 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

const cardStyle = css({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: `${6 / perRem}em`,
});

const containerStyle = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const footerStyles = css({
  ...captionStyles,
  color: lead.rgb,
  justifySelf: 'flex-end',
});

const placeholders: Record<NewsType, JSX.Element> = {
  News: newsPlaceholder,
  Tutorial: trainingPlaceholderIcon,
  'Working Groups': trainingPlaceholderIcon,
};

type NewsCardProps = NewsResponse & {
  noPill?: boolean;
};

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  type,
  title,
  thumbnail,
  text,
  link,
  linkText,
  shortText,
  created,
  noPill = false,
}) => {
  const titleComponent = text ? (
    <LinkHeadline href={news({}).article({ articleId: id }).$} level={4}>
      {title}
    </LinkHeadline>
  ) : (
    <Headline4>{title}</Headline4>
  );
  const newsLink = text && news({}).article({ articleId: id }).$;
  const newsIamge = (
    <>
      {thumbnail ? (
        <img
          alt={`"${title}"'s thumbnail`}
          src={thumbnail}
          css={[imageStyle]}
        />
      ) : (
        placeholders[type]
      )}
    </>
  );

  return (
    <Card>
      <div css={cardStyle}>
        <div css={imageContainerStyle}>
          {newsLink ? (
            <ImageLink link={newsLink}>{newsIamge}</ImageLink>
          ) : (
            newsIamge
          )}
        </div>
        <div css={containerStyle}>
          <div css={headerStyles}>
            <div css={{ paddingRight: `${15 / perRem}em` }}>
              {noPill ? null : <Pill>{type}</Pill>}
              {titleComponent}
            </div>
            {link ? <ExternalLink label={linkText} href={link} /> : null}
          </div>
          <div css={{ flex: 1 }}>
            <Paragraph accent="lead">{shortText}</Paragraph>
          </div>
          <span css={footerStyles}>
            Posted: {formatDate(new Date(created))} by ASAP
          </span>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
