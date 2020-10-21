import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { MembersSection, ProfileSkills, TeamOverview } from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../utils';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type TeamAboutProps = ComponentProps<typeof TeamOverview> &
  ComponentProps<typeof ProfileSkills> &
  Omit<ComponentProps<typeof MembersSection>, 'title'> &
  Pick<TeamResponse, 'pointOfContact'>;

const TeamAbout: React.FC<TeamAboutProps> = ({
  projectTitle,
  projectSummary,
  skills,
  pointOfContact,
  members,
  proposalHref,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamOverview
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalHref={proposalHref}
      />
    ) : null}
    {skills.length ? <ProfileSkills skills={skills} /> : null}
    {members.length ? <MembersSection members={members} /> : null}
    {pointOfContact && (
      <CtaCard href={createMailTo(pointOfContact)} buttonText="Contact PM">
        <strong>Interested in what you have seen?</strong>
        <br /> Reach out to this team and see how you can collaborate
      </CtaCard>
    )}
  </div>
);

export default TeamAbout;
