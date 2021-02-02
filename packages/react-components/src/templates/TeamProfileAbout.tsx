import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  TeamMembersSection,
  ProfileSkills,
  TeamProfileOverview,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileSkills> &
  Omit<ComponentProps<typeof TeamMembersSection>, 'title'> &
  Pick<TeamResponse, 'pointOfContact'> & {
    teamGroupsCard?: React.ReactNode;
  };

const TeamProfileAbout: React.FC<TeamProfileAboutProps> = ({
  projectTitle,
  projectSummary,
  skills,
  pointOfContact,
  members,
  proposalHref,
  teamGroupsCard,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamProfileOverview
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalHref={proposalHref}
      />
    ) : null}
    {skills.length ? <ProfileSkills skills={skills} /> : null}
    {members.length ? <TeamMembersSection members={members} /> : null}
    {teamGroupsCard}
    {pointOfContact && (
      <CtaCard
        href={createMailTo(pointOfContact.email)}
        buttonText="Contact PM"
      >
        <strong>Interested in what you have seen?</strong>
        <br /> Reach out to this team and see how you can collaborate
      </CtaCard>
    )}
  </div>
);

export default TeamProfileAbout;
