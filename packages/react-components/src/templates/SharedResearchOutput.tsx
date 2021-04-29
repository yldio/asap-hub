import React from 'react';
import css from '@emotion/css';
import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import format from 'date-fns/format';

import { TagLabel, Display, Card, Headline2, Divider } from '../atoms';
import { lead } from '../colors';
import { mobileScreen, perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, ExternalLink, TagList } from '../molecules';
import { captionStyles } from '../text';
import { RichText } from '../organisms';

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
  flexDirection: 'row',
  whiteSpace: 'pre',
  marginTop: `${24 / perRem}em`,
  marginBottom: 0,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    marginTop: `${12 / perRem}em`,
    marginBottom: `${12 / perRem}em`,
  },
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchProposalProps = Pick<
  ResearchOutputResponse,
  | 'created'
  | 'addedDate'
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
  addedDate,
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
        <div css={[timestampStyles, captionStyles]}>
          <span>
            Date added:
            {format(new Date(addedDate || created), ' Mo MMMM yyyy')}
            {lastModifiedDate && ' · '}
          </span>
          {lastModifiedDate && (
            <span>
              Last updated:
              {format(new Date(lastModifiedDate), ' Mo MMMM yyyy')}
            </span>
          )}
        </div>
      </Card>
      {(description || !!tags.length) && (
        <Card>
          {description && (
            <div css={{ paddingBottom: `${12 / perRem}em` }}>
              <Headline2 styleAsHeading={4}>Description</Headline2>
              <RichText poorText text={description} />
            </div>
          )}
          {description && !!tags.length && <Divider />}
          {!!tags.length && (
            <>
              <Headline2 styleAsHeading={4}>Tags</Headline2>
              <TagList tags={tags} />
            </>
          )}
        </Card>
      )}
    </div>
  </div>
);

export default SharedResearchOutput;
