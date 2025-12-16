import { css } from '@emotion/react';
import { InterestGroupResponse } from '@asap-hub/model';

import {
  InterestGroupInformation,
  InterestGroupLeadersTabbedCard,
  InterestGroupTeamsTabbedCard,
} from '../organisms';
import { CtaCard } from '../molecules';

import { createMailTo } from '../mail';
import { rem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

const membersSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(36),
});

type InterestGroupProfileAboutProps = Pick<
  InterestGroupResponse,
  'tags' | 'description' | 'active' | 'contactEmails'
> &
  Pick<InterestGroupResponse, 'teams' | 'leaders'> & {
    membersSectionId?: string;
  };
const InterestGroupProfileAbout: React.FC<InterestGroupProfileAboutProps> = ({
  active,

  tags,
  description,

  teams,
  leaders,
  contactEmails,

  membersSectionId,
}) => (
  <div css={styles}>
    <InterestGroupInformation tags={tags} description={description} />
    <div id={membersSectionId}>
      <div css={membersSectionStyles}>
        <InterestGroupLeadersTabbedCard
          leaders={leaders}
          isInterestGroupActive={active}
        />
        <InterestGroupTeamsTabbedCard
          teams={teams}
          isInterestGroupActive={active}
        />
      </div>
    </div>
    {contactEmails.length !== 0 && active && (
      <CtaCard
        href={createMailTo(contactEmails)}
        buttonText="Contact"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> Members are here to help.
      </CtaCard>
    )}
  </div>
);

export default InterestGroupProfileAbout;
