import { gp2 } from '@asap-hub/model';
import {
  Card,
  Headline2,
  Paragraph,
  labIcon,
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
import { workingGroupIcon, locationIcon } from '../icons';
import { mobileQuery } from '../layout';
import { IconWithLabel } from '../molecules';
import colors from '../templates/colors';

const { rem } = pixels;

const countsContainerStyles = css({
  color: colors.neutral900.rgb,
  margin: `${rem(32)} 0`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
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

const newsItemStyles = css({
  display: 'grid',
  grid: `
    "image headline link" 32px
    "image content content" auto
    /192px auto min-content
  `,
  columnGap: '24px',
  rowGap: '24px',
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
  return (
    <Card>
      <Headline2>News and Updates</Headline2>
      <Paragraph accent="lead">
        {`The ${firstNews.title} has recently been published, with some amazing
    new milestones reached thanks to the continued hard work of everyone on
    the GP2 programme. Here is just a snippet of what you can read about:`}
      </Paragraph>
      <div css={countsContainerStyles}>
        <IconWithLabel noMargin icon={labIcon}>
          Samples completed: <strong>{firstNews.sampleCount}</strong>
        </IconWithLabel>
        <IconWithLabel noMargin icon={locationIcon}>
          Article numbers: <strong>{firstNews.articleCount}</strong>
        </IconWithLabel>
        <IconWithLabel noMargin icon={workingGroupIcon}>
          Cohorts: <strong>{firstNews.cohortCount}</strong>
        </IconWithLabel>
      </div>
      <Divider />
      {news.map(({ title, link, linkText, shortText, created }) => (
        <>
          <article css={newsItemStyles}>
            <div css={imageStyles}>{newsPlaceholder}</div>
            <div css={css({ gridArea: 'headline' })}>
              <Subtitle noMargin styleAsHeading={4}>
                {title}
              </Subtitle>
            </div>
            {link && (
              <div css={css({ gridArea: 'link' })}>
                <ExternalLink href={link} label={linkText} noMargin />
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
        </>
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
