import { css } from '@emotion/react';
import { InterestGroupResponse } from '@asap-hub/model';

import {
  InterestGroupInformation,
  InterestGroupLeadersTabbedCard,
  InterestGroupTeamsTabbedCard,
} from '../organisms';
import { CtaCard } from '../molecules';

import { createMailTo } from '../mail';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const membersSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: `${36 / perRem}em`,
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
    {contactEmails.length !== 0 && (
      <CtaCard
        href={createMailTo(contactEmails)}
        buttonText="Contact PM"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> The project manager is here to help.
      </CtaCard>
    )}
  </div>
);

export default InterestGroupProfileAbout;
