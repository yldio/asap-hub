import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { GroupResponse } from '@asap-hub/model';

import {
  GroupInformation,
  GroupMembersSection,
  GroupTools,
} from '../organisms';
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
}) => (
  <div css={styles}>
    <GroupInformation tags={tags} description={description} />
    <GroupTools calendarId={calendars[0] && calendars[0].id} tools={tools} />
    <div id={membersSectionId}>
      <GroupMembersSection teams={teams} leaders={leaders} />
    </div>
  </div>
);

export default GroupProfileAbout;
