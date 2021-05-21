import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';

import {
  GroupInformation,
  GroupMembersSection,
  GroupTools,
} from '../organisms';
import { CtaCard } from '../molecules';

import { createMailTo } from '../mail';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type GroupProfileAboutProps = Pick<
  GroupResponse,
  'tags' | 'description' | 'tools' | 'calendars'
> &
  Pick<ComponentProps<typeof GroupMembersSection>, 'teams' | 'leaders'> & {
    membersSectionId?: string;
  };
const GroupProfileAbout: React.FC<GroupProfileAboutProps> = ({
  tags,
  description,

  tools,
  calendars,

  teams,
  leaders,

  membersSectionId,
}) => {
  const pmsEmails = leaders
    .filter(({ role }) => role === 'Project Manager')
    .map(({ user }) => user.email);

  return (
    <div css={styles}>
      <GroupInformation tags={tags} description={description} />
      <GroupTools calendarId={calendars[0] && calendars[0].id} tools={tools} />
      <div id={membersSectionId}>
        <GroupMembersSection teams={teams} leaders={leaders} />
      </div>
      {pmsEmails.length !== 0 && (
        <CtaCard href={createMailTo(pmsEmails)} buttonText="Contact PM">
          <strong>Interested in what you have seen?</strong>
          <br /> Reach out to this group and see how you can collaborate
        </CtaCard>
      )}
    </div>
  );
};

export default GroupProfileAbout;
