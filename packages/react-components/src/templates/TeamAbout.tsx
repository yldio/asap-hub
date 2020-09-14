import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { pearl, steel } from '../colors';
import { MembersSection, SkillsSection, TeamOverview } from '../organisms';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
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
  <main css={styles}>
    {projectTitle ? (
      <TeamOverview
        projectTitle={projectTitle}
        projectSummary={projectSummary}
      />
    ) : null}
    {skills.length ? <SkillsSection skills={skills} /> : null}
    {members.length ? <MembersSection members={members} /> : null}
  </main>
);

export default TeamAbout;
