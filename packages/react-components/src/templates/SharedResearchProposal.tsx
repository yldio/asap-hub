import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Pill, Display, Link, Card, Caption } from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { teamIcon } from '../icons';
import { BackLink } from '../molecules';
import { formatDate } from '../date';

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
  'created' | 'addedDate' | 'team' | 'description' | 'title' | 'type'
> & {
  backHref: string;
};

const SharedResearchProposal: React.FC<SharedResearchProposalProps> = ({
  created,
  addedDate,
  team,
  description,
  title,
  type,
  backHref,
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <Card>
      <Pill>{type}</Pill>
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
          Date Added: {formatDate(new Date(addedDate || created))}
        </Caption>
      </div>
    </Card>
  </div>
);

export default SharedResearchProposal;
