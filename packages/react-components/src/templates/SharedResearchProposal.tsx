import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';
import format from 'date-fns/format';
import { network } from '@asap-hub/routing';

import { TagLabel, Display, Link, Card, Caption } from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { teamIcon } from '../icons';
import { BackLink } from '../molecules';

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const postedStyles = css({
  color: lead.rgb,
});

type SharedResearchProposalProps = Pick<
  ResearchOutputResponse,
  'created' | 'publishDate' | 'team' | 'description' | 'title' | 'type'
> & {
  backHref: string;
};

const SharedResearchProposal: React.FC<SharedResearchProposalProps> = ({
  created,
  publishDate,
  team,
  description,
  title,
  type,
  backHref,
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <Card>
      <TagLabel>{type}</TagLabel>
      <Display styleAsHeading={3}>{title}</Display>
      {team && (
        <span css={teamMemberStyles}>
          <span css={iconStyles}>{teamIcon} </span>
          <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
            Team {team.displayName}
          </Link>
        </span>
      )}
      <RichText toc text={description} />
      <div css={postedStyles}>
        <Caption asParagraph>
          Date Added:
          {format(new Date(publishDate || created), ' Mo MMMM yyyy')}
        </Caption>
      </div>
    </Card>
  </div>
);

export default SharedResearchProposal;
