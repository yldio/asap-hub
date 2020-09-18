import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { MembersSection, SkillsSection, TeamOverview } from '../organisms';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type TeamAboutProps = ComponentProps<typeof TeamOverview> &
  ComponentProps<typeof SkillsSection> &
  ComponentProps<typeof MembersSection>;

const TeamAbout: React.FC<TeamAboutProps> = ({
  projectTitle,
  projectSummary,
  skills,
  members,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamOverview
        projectTitle={projectTitle}
        projectSummary={projectSummary}
      />
    ) : null}
    {skills.length ? <SkillsSection skills={skills} /> : null}
    {members.length ? <MembersSection members={members} /> : null}
  </div>
);

export default TeamAbout;
