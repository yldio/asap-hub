import React, { ComponentProps, useMemo } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  ProjectProfileOverview,
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
    | 'proposalURL'
  > & {
    teamGroupsCard?: React.ReactNode;
    readonly teamListElementId: string;
    hideExpertiseAndResources?: boolean;
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
  proposalURL,
  hideExpertiseAndResources,
}) => {
  const projectsMVPEnabled = isEnabled('PROJECTS_MVP');

  const pointOfContactEmail = useMemo(() => {
    if (projectsMVPEnabled) {
      return pointOfContact;
    }
    // Legacy mode: use PM email from members (pointOfContact is only available when flag is enabled)
    return members.find((member) => member.role === 'Project Manager')?.email;
  }, [pointOfContact, members, projectsMVPEnabled]);

  return (
    <div css={styles}>
      {/* Overview Section - Different based on PROJECTS_MVP flag */}
      {projectsMVPEnabled ? (
        // New MVP version: TeamProfileOverview
        teamDescription ? (
          <TeamProfileOverview
            tags={tags}
            teamDescription={teamDescription}
            teamType={teamType}
            researchTheme={researchTheme}
            resourceType={resourceType}
          />
        ) : null
      ) : // Legacy version: ProjectProfileOverview
      projectTitle ? (
        <ProjectProfileOverview
          supplementGrant={supplementGrant}
          projectTitle={projectTitle}
          projectSummary={projectSummary}
          proposalURL={proposalURL}
        />
      ) : null}

      {/* Expertise and Resources - Only in legacy version */}
      {!projectsMVPEnabled && tags && tags.length ? (
        <ProfileExpertiseAndResources
          hideExpertiseAndResources={hideExpertiseAndResources}
          tags={tags}
        />
      ) : null}

      {/* Projects Card - Only in MVP version */}
      {projectsMVPEnabled && projectTitle && linkedProjectId ? (
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

      {/* Labs Card - Only in MVP version */}
      {projectsMVPEnabled && labs && labs.length ? (
        <TeamLabsCard labs={labs} isTeamActive={teamStatus === 'Active'} />
      ) : null}

      {/* Team Members */}
      <section id={teamListElementId} css={membersCardStyles}>
        <TeamMembersTabbedCard
          title="Team Members"
          members={members}
          isTeamInactive={!!inactiveSince}
        />
      </section>

      {/* Team Groups Card */}
      {projectsMVPEnabled
        ? teamType !== 'Resource Team' && teamGroupsCard
        : teamGroupsCard}

      {/* Contact CTA */}
      {pointOfContactEmail &&
        (!projectsMVPEnabled || teamStatus === 'Active') && (
          <CtaCard
            href={createMailTo(pointOfContactEmail)}
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
