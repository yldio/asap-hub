import { FC } from 'react';
import { css } from '@emotion/react';
import {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
  ProjectStatus,
  ProjectType,
} from '@asap-hub/model';

import { Card, Pill, Link } from '../atoms';
import { TagList, LinkHeadline, UsersList } from '../molecules';
import { rem } from '../pixels';
import { formatProjectDate } from '../date';
import {
  clockIcon,
  googleDriveIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  ResourceMemberIcon,
  MemberIcon,
  InactiveBadgeIcon,
} from '../icons';
import { fern, lead } from '../colors';
import TrainerIcon from '../icons/trainer';

const cardStyles = css({
  padding: rem(0),
});

const headerStyles = css({
  display: 'flex',
  gap: rem(12),
  marginBottom: rem(16),
});

const titleStyles = css({
  marginBottom: rem(16),
});

const metadataContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  marginBottom: rem(16),
});

const metadataRowStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(8),
  fontSize: rem(17),
  color: lead.rgb,
});

const iconStyles = css({
  display: 'inline-flex',
  width: rem(24),
  height: rem(24),
  flexShrink: 0, // Prevent icon from shrinking
  '& svg': {
    width: '100%',
    height: '100%',
  },
});

const teamNameStyles = css({
  color: fern.rgb,
  fontWeight: 500,
});

const tagsContainerStyles = css({
  marginTop: rem(16),
});

type ProjectCardProps = DiscoveryProject | ResourceProject | TraineeProject;

export const getProjectTypeLabel = (projectType: ProjectType): string => {
  switch (projectType) {
    case 'Discovery':
      return 'Discovery Project';
    case 'Resource':
      return 'Resource Project';
    case 'Trainee':
      return 'Trainee Project';
    default:
      return 'Discovery Project';
  }
};

export const getStatusPillAccent = (
  status: ProjectStatus,
): 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'Active':
      return 'info';
    case 'Complete':
      return 'success';
    case 'Closed':
      return 'warning';
    default:
      return 'info';
  }
};

export const getCardAccentByStatus = (
  status: ProjectStatus,
): 'default' | 'neutral200' => {
  switch (status) {
    case 'Complete':
    case 'Closed':
      return 'neutral200';
    default:
      return 'default';
  }
};

const ProjectCard: FC<ProjectCardProps> = (project) => {
  const getHref = () => `/projects/${project.projectType}/${project.id}`;

  return (
    <Card accent={getCardAccentByStatus(project.status)}>
      <div css={cardStyles} data-testid="project-card-id">
        {/* Header with Pills */}
        <div css={headerStyles}>
          <Pill accent={getStatusPillAccent(project.status)}>
            {project.status}
          </Pill>
          <Pill>{getProjectTypeLabel(project.projectType)}</Pill>
          {project.projectType === 'Discovery' && (
            <Pill>{project.researchTheme}</Pill>
          )}
          {project.projectType === 'Resource' && (
            <Pill>{project.resourceType}</Pill>
          )}
        </div>

        {/* Title */}
        <div css={titleStyles}>
          <LinkHeadline level={3} styleAsHeading={4} href={getHref()}>
            {project.title}
          </LinkHeadline>
        </div>

        {/* Metadata Container */}
        <div css={metadataContainerStyles}>
          {/* Google Drive Link for Resource Projects */}
          {project.projectType === 'Resource' && project.googleDriveLink && (
            <div css={{ width: 'fit-content' }}>
              <Link href={project.googleDriveLink} buttonStyle small>
                {googleDriveIcon} Access Drive
              </Link>
            </div>
          )}

          {/* Team Name for Discovery Projects */}
          {project.projectType === 'Discovery' && (
            <div css={metadataRowStyles}>
              <span css={iconStyles}>
                <DiscoveryTeamIcon />
              </span>
              {project.teamId ? (
                <Link href={`/teams/${project.teamId}`}>
                  <span css={teamNameStyles}>{project.teamName}</span>
                </Link>
              ) : (
                <span css={teamNameStyles}>{project.teamName}</span>
              )}
              {project.inactiveSinceDate && <InactiveBadgeIcon />}
            </div>
          )}

          {/* Team Name for Resource Projects (if team-based) */}
          {project.projectType === 'Resource' &&
            project.isTeamBased &&
            project.teamName && (
              <div css={metadataRowStyles}>
                <span css={iconStyles}>
                  <ResourceTeamIcon />
                </span>
                {project.teamId ? (
                  <Link href={`/teams/${project.teamId}`}>
                    <span css={teamNameStyles}>{project.teamName}</span>
                  </Link>
                ) : (
                  <span css={teamNameStyles}>{project.teamName}</span>
                )}
              </div>
            )}

          {/* Members for Resource Projects (if not team-based) */}
          {project.projectType === 'Resource' &&
            !project.isTeamBased &&
            project.members &&
            project.members.length > 0 && (
              <div css={metadataRowStyles}>
                <span css={iconStyles}>
                  <ResourceMemberIcon />
                </span>
                <UsersList users={project.members} separator="•" />
              </div>
            )}

          {/* Members for Trainee Projects */}
          {project.projectType === 'Trainee' && (
            <div>
              <div css={metadataRowStyles}>
                <span css={iconStyles}>
                  <TrainerIcon />
                </span>
                <UsersList users={[project.trainer]} separator="•" />
              </div>
              <div css={metadataRowStyles}>
                <span css={iconStyles}>
                  <MemberIcon />
                </span>
                <UsersList users={project.members} separator="•" />
              </div>
            </div>
          )}

          {/* Duration */}
          <div css={metadataRowStyles}>
            <span css={iconStyles}>{clockIcon}</span>
            <span>
              {formatProjectDate(project.startDate)} -{' '}
              {formatProjectDate(project.endDate)} • ({project.duration})
            </span>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div css={tagsContainerStyles}>
            <TagList tags={project.tags} max={3} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
