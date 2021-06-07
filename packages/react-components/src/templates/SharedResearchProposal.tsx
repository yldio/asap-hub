import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Pill, Display, Card, Caption } from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, TeamsList } from '../molecules';
import { formatDate } from '../date';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const postedStyles = css({
  color: lead.rgb,
});

type SharedResearchProposalProps = Pick<
  ResearchOutputResponse,
  'created' | 'addedDate' | 'teams' | 'description' | 'title' | 'type'
> & {
  backHref: string;
};

const SharedResearchProposal: React.FC<SharedResearchProposalProps> = ({
  created,
  addedDate,
  teams,
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
      <TeamsList inline teams={teams} />
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
