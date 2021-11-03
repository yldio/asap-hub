import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Pill, Display, Card, Caption } from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, CtaCard, AssociationList } from '../molecules';
import { formatDate } from '../date';
import { createMailTo } from '../mail';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
  maxWidth: '100%',
  overflow: 'hidden',
});

const postedStyles = css({
  color: lead.rgb,
});

type SharedResearchProposalProps = Pick<
  ResearchOutputResponse,
  | 'created'
  | 'addedDate'
  | 'teams'
  | 'description'
  | 'title'
  | 'type'
  | 'contactEmails'
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
  contactEmails,
  backHref,
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <div css={cardsStyles}>
      <Card>
        <Pill>{type}</Pill>
        <Display styleAsHeading={3}>{title}</Display>
        <AssociationList type="Team" inline associations={teams} />
        <RichText toc text={description} />
        <div css={postedStyles}>
          <Caption asParagraph>
            Date Added: {formatDate(new Date(addedDate || created))}
          </Caption>
        </div>
      </Card>
      {!!contactEmails.length && (
        <div>
          <CtaCard href={createMailTo(contactEmails)} buttonText="Contact PM">
            <strong>Interested in what you have seen?</strong>
            <br /> Reach out to the PMs associated with this output
          </CtaCard>
        </div>
      )}
    </div>
  </div>
);

export default SharedResearchProposal;
