import { gp2 } from '@asap-hub/model';
import {
  Card,
  Headline2,
  Paragraph,
  Divider,
  newsPlaceholder,
  Subtitle,
  ExternalLink,
  Caption,
  formatDate,
  Button,
  chevronCircleUpIcon,
  chevronCircleDownIcon,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';

import { mobileQuery } from '../layout';

import colors from '../templates/colors';

const { rem } = pixels;

const imageStyles = css({
  gridArea: 'image',
  svg: { borderRadius: '8px' },
  [mobileQuery]: { display: 'none' },
});

const contentStyles = css({
  gridArea: 'content',
  color: colors.neutral900.rgb,
});

const newsItemStyles = css({
  display: 'grid',
  grid: `
    "image headline link" 32px
    "image content content" auto
    /192px auto min-content
  `,
  columnGap: rem(24),
  rowGap: rem(24),
  margin: `${rem(32)} 0`,
  [mobileQuery]: {
    grid: `
    "headline link" min-content
    "content content" auto
    / auto min-content
  `,
  },
});

const buttonContainerStyles = css({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  marginBottom: rem(8),
});

const chevronStyles = {
  display: 'inline-flex',
  verticalAlign: 'middle',
  paddingRight: rem(12),
};

type DashboardNewsProps = Pick<gp2.ListNewsResponse, 'items'>;

const DashboardNews: React.FC<DashboardNewsProps> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);
  const news = expanded ? items : items.slice(0, 1);
  const firstNews = items[0];
  if (firstNews === undefined) return null;
  return (
    <Card>
      <Headline2>News and Updates</Headline2>
      <Paragraph accent="lead">
        {`The ${firstNews.title} has recently been published, with some amazing
    new milestones reached thanks to the continued hard work of everyone on
    the GP2 programme. Here is just a snippet of what you can read about:`}
      </Paragraph>
      <Divider />
      {news.map(({ title, link, linkText, shortText, created, id }) => (
        <div key={id}>
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
              <Paragraph>{shortText}</Paragraph>
              <Caption asParagraph>
                Posted: {formatDate(new Date(created))} by ASAP
              </Caption>
            </div>
          </article>
          <Divider />
        </div>
      ))}

      {items.length > 1 && (
        <div css={buttonContainerStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            <span css={chevronStyles}>
              {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
            </span>
            Show {expanded ? 'less' : 'more'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DashboardNews;
