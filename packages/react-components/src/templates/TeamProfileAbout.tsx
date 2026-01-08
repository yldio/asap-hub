import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamLabsCard,
  TeamMembersTabbedCard,
  TeamProfileOverview,
  TeamProjectsCard,
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

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    TeamResponse,
    | 'pointOfContact'
    | 'members'
    | 'inactiveSince'
    | 'supplementGrant'
    | 'teamStatus'
    | 'teamType'
    | 'projectTitle'
    | 'projectSummary'
    | 'linkedProjectId'
    | 'projectStatus'
    | 'tags'
    | 'researchTheme'
    | 'resourceType'
    | 'labs'
    | 'projectType'
  > & {
    teamGroupsCard?: React.ReactNode;
    readonly teamListElementId: string;
  };

const TeamProfileAbout: React.FC<TeamProfileAboutProps> = ({
  inactiveSince,
  tags,
  projectTitle,
  projectSummary,
  linkedProjectId,
  projectStatus,
  supplementGrant,
  pointOfContact,
  members,
  teamGroupsCard,
  teamListElementId,
  teamStatus,
  teamType,
  teamDescription,
  researchTheme,
  resourceType,
  projectType,
  labs,
}) => (
  <div css={styles}>
    {teamDescription ? (
      <TeamProfileOverview
        tags={tags}
        teamDescription={teamDescription}
        teamType={teamType}
        researchTheme={researchTheme}
        resourceType={resourceType}
      />
    ) : null}
    {isEnabled('PROJECTS_MVP') && projectTitle && linkedProjectId ? (
      <TeamProjectsCard
        teamType={teamType}
        projectType={projectType}
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        linkedProjectId={linkedProjectId}
        projectStatus={projectStatus}
        supplementGrant={supplementGrant}
        researchTheme={researchTheme}
        resourceType={resourceType}
      />
    ) : null}
    {isEnabled('PROJECTS_MVP') && labs && labs.length ? (
      <TeamLabsCard labs={labs} isTeamActive={teamStatus === 'Active'} />
    ) : null}
    <section id={teamListElementId} css={membersCardStyles}>
      <TeamMembersTabbedCard
        title="Team Members"
        members={members}
        isTeamInactive={!!inactiveSince}
      />
    </section>
    {teamType !== 'Resource Team' && teamGroupsCard}
    {pointOfContact && teamStatus === 'Active' && (
      <CtaCard
        href={createMailTo(pointOfContact.email)}
        buttonText="Contact"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> Members are here to help.
      </CtaCard>
    )}
  </div>
);

export default TeamProfileAbout;
