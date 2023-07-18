import { css } from '@emotion/react';
import { InterestGroupResponse } from '@asap-hub/model';

import {
  InterestGroupInformation,
  InterestGroupTools,
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
  'tags' | 'description' | 'tools' | 'calendars' | 'active' | 'contactEmails'
> &
  Pick<InterestGroupResponse, 'teams' | 'leaders'> & {
    membersSectionId?: string;
  };
const InterestGroupProfileAbout: React.FC<InterestGroupProfileAboutProps> = ({
  active,

  tags,
  description,

  tools,
  calendars,

  teams,
  leaders,
  contactEmails,

  membersSectionId,
}) => (
  <div css={styles}>
    <InterestGroupInformation tags={tags} description={description} />
    <InterestGroupTools
      calendarId={calendars[0] && calendars[0].id}
      tools={tools}
      active={active}
    />
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
      <CtaCard href={createMailTo(contactEmails)} buttonText="Contact PM">
        <strong>Interested in what you have seen?</strong>
        <br /> Reach out to this group and see how you can collaborate
      </CtaCard>
    )}
  </div>
);

export default InterestGroupProfileAbout;
