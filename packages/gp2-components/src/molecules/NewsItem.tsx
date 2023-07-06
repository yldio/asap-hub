import { gp2 } from '@asap-hub/model';
import {
  newsPlaceholder,
  Subtitle,
  ExternalLink,
  Paragraph,
  Caption,
  formatDate,
  pixels,
  Card,
  Ellipsis,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { mobileQuery } from '../layout';
import colors from '../templates/colors';

const { rem } = pixels;

const newsItemStyles = css({
  display: 'grid',
  grid: `
    "image headline link" 32px
    "image content content" auto
    /192px auto min-content
  `,
  columnGap: rem(24),
  rowGap: rem(24),
  margin: `${rem(32)} ${rem(24)}`,
  [mobileQuery]: {
    grid: `
    "headline link" min-content
    "content content" auto
    / auto min-content
  `,
  },
});

const imageStyles = css({
  gridArea: 'image',
  svg: { borderRadius: '8px' },
  [mobileQuery]: { display: 'none' },
});

const contentStyles = css({
  gridArea: 'content',
  color: colors.neutral900.rgb,
});

type NewsItemProps = gp2.NewsResponse;

const NewsItem: React.FC<NewsItemProps> = ({
  title,
  shortText,
  created,
  linkText,
  link,
}) => (
  <Card padding={false}>
    <article css={newsItemStyles}>
      <div css={imageStyles}>{newsPlaceholder}</div>
      <div css={css({ gridArea: 'headline' })}>
        <Subtitle noMargin styleAsHeading={4}>
          {title}
        </Subtitle>
      </div>
      {link && (
        <div css={css({ gridArea: 'link' })}>
          <ExternalLink href={link} label={linkText} />
        </div>
      )}
      <div css={contentStyles}>
        <Paragraph>
          <Ellipsis numberOfLines={3}>{shortText}</Ellipsis>
        </Paragraph>
        <Caption asParagraph>
          Posted: {formatDate(new Date(created))} by ASAP
        </Caption>
      </div>
    </article>
  </Card>
);

export default NewsItem;
