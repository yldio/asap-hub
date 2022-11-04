import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';

import {
  GroupInformation,
  GroupTools,
  GroupLeadersTabbedCard,
  GroupTeamsTabbedCard,
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

type GroupProfileAboutProps = Pick<
  GroupResponse,
  'tags' | 'description' | 'tools' | 'calendars' | 'active'
> &
  Pick<GroupResponse, 'teams' | 'leaders'> & {
    membersSectionId?: string;
  };
const GroupProfileAbout: React.FC<GroupProfileAboutProps> = ({
  active,

  tags,
  description,

  tools,
  calendars,

  teams,
  leaders,

  membersSectionId,
}) => {
  const contactEmails = leaders
    .filter(({ role }) => role === 'Project Manager')
    .map(({ user }) => user.email);

  return (
    <div css={styles}>
      <GroupInformation tags={tags} description={description} />
      <GroupTools
        calendarId={calendars[0] && calendars[0].id}
        tools={tools}
        active={active}
      />
      <div id={membersSectionId}>
        <div css={membersSectionStyles}>
          <GroupLeadersTabbedCard
            title="Interest Group Leaders"
            leaders={leaders}
            isGroupInactive={!active}
          />
          <GroupTeamsTabbedCard
            title="Interest Group Teams"
            teams={teams}
            isGroupInactive={!active}
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
};

export default GroupProfileAbout;
