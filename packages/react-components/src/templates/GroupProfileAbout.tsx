import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';

import {
  GroupInformation,
  GroupMembersSection,
  GroupTools,
  TeamsTabbedCard,
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
  'tags' | 'description' | 'tools' | 'calendars' | 'active'
> &
  Pick<ComponentProps<typeof GroupMembersSection>, 'teams' | 'leaders'> & {
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
        {active ? (
          <GroupMembersSection teams={teams} leaders={leaders} />
        ) : (
          <TeamsTabbedCard title="Interest Group Teams" teams={teams} />
        )}
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
