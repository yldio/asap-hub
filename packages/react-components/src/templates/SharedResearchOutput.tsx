import React from 'react';
import css from '@emotion/css';
import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import format from 'date-fns/format';

import {
  TagLabel,
  Display,
  Card,
  Caption,
  Headline2,
  Paragraph,
  Divider,
} from '../atoms';
import { lead } from '../colors';
import { mobileScreen, perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, ExternalLink, TagList } from '../molecules';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const headerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

const timestampStyles = css({
  color: lead.rgb,
  display: 'flex',
  whiteSpace: 'pre',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchProposalProps = Pick<
  ResearchOutputResponse,
  | 'created'
  | 'publishDate'
  | 'team'
  | 'description'
  | 'title'
  | 'type'
  | 'link'
  | 'tags'
  | 'lastModifiedDate'
> & {
  backHref: string;
};

const SharedResearchOutput: React.FC<SharedResearchProposalProps> = ({
  created,
  publishDate,
  title,
  description,
  type,
  backHref,
  tags,
  link,
  lastModifiedDate,
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <div css={cardsStyles}>
      <Card>
        <div css={headerStyles}>
          <div css={typeStyles}>
            <TagLabel>{type}</TagLabel>
          </div>
          {link ? (
            <ExternalLink label={researchOutputLabels[type]} href={link} />
          ) : null}
        </div>
        <Display styleAsHeading={3}>{title}</Display>
        <Caption asParagraph>
          <div css={timestampStyles}>
            <div>
              Date added:
              {format(new Date(publishDate || created), ' Mo MMMM yyyy')}
              {lastModifiedDate && ' · '}
            </div>
            {lastModifiedDate && (
              <div>
                Last updated:
                {format(new Date(lastModifiedDate), ' Mo MMMM yyyy')}
              </div>
            )}
          </div>
        </Caption>
      </Card>
      <Card>
        <Headline2 styleAsHeading={5}>Description</Headline2>
        <Paragraph>{description}</Paragraph>
        <Divider />
        <Headline2 styleAsHeading={5}>Tags</Headline2>
        <TagList tags={tags} />
      </Card>
    </div>
  </div>
);

export default SharedResearchOutput;
