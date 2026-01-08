import React from 'react';
import { css } from '@emotion/react';
import { TeamMember, TeamResponse } from '@asap-hub/model';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamMembersTabbedCard,
  ProjectProfileOverview,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

const membersCardStyles = css({
  overflow: 'hidden',
});

type ProjectProfileAboutProps = {
  // ProjectProfileOverview props
  projectTitle?: string;
  projectSummary?: string;
  proposalURL?: string;
  supplementGrant?: {
    title: string;
    description?: string;
    proposalURL?: string;
  };
  // ProfileExpertiseAndResources props
  tags?: Array<{ id: string; name: string }>;
  hideExpertiseAndResources?: boolean;
  // Additional props
  pointOfContact?: TeamResponse['pointOfContact'];
  members: TeamMember[];
  inactiveSince?: string;
  teamGroupsCard?: React.ReactNode;
  readonly teamListElementId: string;
};

const ProjectProfileAbout: React.FC<ProjectProfileAboutProps> = ({
  inactiveSince,
  projectTitle,
  projectSummary,
  tags,
  pointOfContact,
  members,
  proposalURL,
  teamGroupsCard,
  teamListElementId,
  supplementGrant,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <ProjectProfileOverview
        supplementGrant={supplementGrant}
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalURL={proposalURL}
      />
    ) : null}
    {tags && tags.length ? (
      <ProfileExpertiseAndResources hideExpertiseAndResources tags={tags} />
    ) : null}
    <section id={teamListElementId} css={membersCardStyles}>
      <TeamMembersTabbedCard
        title="Team Members"
        members={members}
        isTeamInactive={!!inactiveSince}
      />
    </section>
    {teamGroupsCard}
    {pointOfContact && (
      <CtaCard
        href={createMailTo(pointOfContact)}
        buttonText="Contact"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> Members are here to help.
      </CtaCard>
    )}
  </div>
);

export default ProjectProfileAbout;
