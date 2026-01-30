import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamLabsCard,
  TeamMembersTabbedCard,
  TeamProfileOverview,
  TeamProjectsCard,
  TeamResourcesCard,
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
    | 'resourceTitle'
    | 'resourceDescription'
    | 'resourceButtonCopy'
    | 'resourceContactEmail'
    | 'resourceLink'
  > & {
    isAsapTeam: boolean;
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
  resourceTitle,
  resourceDescription,
  resourceButtonCopy,
  resourceContactEmail,
  resourceLink,
  isAsapTeam,
}) => {
  const showTeamOverview = Boolean(teamDescription);
  const showProjectsCard = Boolean(projectTitle) && Boolean(linkedProjectId);
  const showLabsCard = Boolean(labs?.length) && !isAsapTeam;
  const showTeamGroupsCard = teamType !== 'Resource Team' && teamGroupsCard;
  const showResourcesCard = teamType === 'Resource Team';
  const showContactCta = pointOfContact && teamStatus === 'Active';

  return (
    <div css={styles}>
      {showTeamOverview && (
        <TeamProfileOverview
          tags={tags}
          teamDescription={teamDescription}
          teamType={teamType}
          researchTheme={researchTheme}
          resourceType={resourceType}
        />
      )}
      {showResourcesCard && (
        <TeamResourcesCard
          resourceTitle={resourceTitle}
          resourceDescription={resourceDescription}
          resourceButtonCopy={resourceButtonCopy}
          resourceContactEmail={resourceContactEmail}
          resourceLink={resourceLink}
        />
      )}
      {showProjectsCard && (
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
      )}
      {showLabsCard && (
        <TeamLabsCard labs={labs} isTeamActive={teamStatus === 'Active'} />
      )}
      <section id={teamListElementId} css={membersCardStyles}>
        <TeamMembersTabbedCard
          title="Team Members"
          members={members}
          isTeamInactive={Boolean(inactiveSince)}
        />
      </section>

      {showTeamGroupsCard}

      {showContactCta && (
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
};

export default TeamProfileAbout;
