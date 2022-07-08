import { css } from '@emotion/react';
import { NewsResponse, NewsType } from '@asap-hub/model';
import { news } from '@asap-hub/routing';

import { Card, Paragraph, Headline4, Pill, Caption, Anchor } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { formatDate } from '../date';
import {
  newsPlaceholder,
  newsEventPlaceholderIcon,
  trainingPlaceholderIcon,
} from '../icons';
import { ExternalLink } from '../molecules';

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${6 / perRem}em`,
  height: `${184 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  marginBottom: `${12 / perRem}em`,
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

const placeholders: Record<NewsType, JSX.Element> = {
  News: newsPlaceholder,
  Event: newsEventPlaceholderIcon,
  Training: trainingPlaceholderIcon,
  Tutorial: trainingPlaceholderIcon,
};

type NewsCardProps = NewsResponse;

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
}) => {
  const titleComponent = text ? (
    <Anchor href={news({}).article({ articleId: id }).$}>
      <Headline4>{title}</Headline4>
    </Anchor>
  ) : (
    <Headline4>{title}</Headline4>
  );

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
            <Pill>{type}</Pill>
            {link ? <ExternalLink label={linkText} href={link} /> : null}
          </div>
          {titleComponent}
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

export default NewsCard;
