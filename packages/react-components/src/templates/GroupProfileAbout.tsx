import React, { ComponentProps } from 'react';
import css from '@emotion/css';
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
    .filter((pm) => pm.role.match(/project manager/i))
    .map((pm) => pm.user.email);

  return (
    <div css={styles}>
      <GroupInformation tags={tags} description={description} />
      <GroupTools calendarId={calendars[0] && calendars[0].id} tools={tools} />
      <div id={membersSectionId}>
        <GroupMembersSection teams={teams} leaders={leaders} />
      </div>
      {pmsEmails.length !== 0 && (
        <CtaCard
          href={
            pmsEmails.length === 1
              ? createMailTo(pmsEmails[0])
              : createMailTo(pmsEmails)
          }
          buttonText="Contact PM"
        >
          <strong>Interested in what you have seen?</strong>
          <br /> Reach out to this group and see how you can collaborate
        </CtaCard>
      )}
    </div>
  );
};

export default GroupProfileAbout;
