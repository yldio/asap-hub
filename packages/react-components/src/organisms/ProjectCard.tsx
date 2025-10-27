import { FC } from 'react';
import { css } from '@emotion/react';

import { Card, Pill, Link } from '../atoms';
import { TagList, LinkHeadline, UsersList } from '../molecules';
import { rem } from '../pixels';
import {
  clockIcon,
  googleDriveIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  ResourceMemberIcon,
  MemberIcon,
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

type BaseProject = {
  readonly id: string;
  readonly title: string;
  readonly status: 'Active' | 'Complete' | 'Closed';
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly tags: string[];
};

type DiscoveryProject = BaseProject & {
  readonly projectType: 'Discovery';
  readonly researchTheme: string;
  readonly teamName: string;
  readonly teamId?: string;
};

type ProjectMember = {
  readonly id: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly alumniSinceDate?: string;
  readonly href: string;
};

type ResourceProject = BaseProject & {
  readonly projectType: 'Resource';
  readonly resourceType: string;
  readonly isTeamBased: boolean;
  readonly teamName?: string;
  readonly teamId?: string;
  readonly members?: ReadonlyArray<ProjectMember>;
  readonly googleDriveLink?: string;
};

type TraineeProject = BaseProject & {
  readonly projectType: 'Trainee';
  readonly trainer: ProjectMember;
  readonly members: ReadonlyArray<ProjectMember>;
};

type ProjectCardProps = DiscoveryProject | ResourceProject | TraineeProject;

const ProjectCard: FC<ProjectCardProps> = (project) => {
  const getProjectTypeLabel = () => {
    switch (project.projectType) {
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

  const getStatusAccent = () => {
    switch (project.status) {
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

  const getCardAccent = () => {
    switch (project.status) {
      case 'Complete':
      case 'Closed':
        return 'neutral200';
      default:
        return 'default';
    }
  };

  const getHref = () => `/projects/${project.projectType}/${project.id}`;

  return (
    <Card accent={getCardAccent()}>
      <div css={cardStyles}>
        {/* Header with Pills */}
        <div css={headerStyles}>
          <Pill accent={getStatusAccent()}>{project.status}</Pill>
          <Pill>{getProjectTypeLabel()}</Pill>
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
              {project.startDate} - {project.endDate} • {project.duration}
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
