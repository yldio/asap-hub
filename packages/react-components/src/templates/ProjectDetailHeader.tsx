import { ProjectDetail } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Display, Pill, Link, CopyButton, TabLink } from '../atoms';
import { lead, paper } from '../colors';
import {
  googleDriveIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  ResourceMemberIcon,
  MemberIcon,
  // plusIcon,
} from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import {
  // DropdownButton,
  UsersList,
  TabNav,
  ProjectDuration,
} from '../molecules';
import { rem, tabletScreen } from '../pixels';
import {
  getProjectTypeLabel,
  getStatusPillAccent,
} from '../organisms/ProjectCard';
import TrainerIcon from '../icons/trainer';

const containerStyles = css({
  backgroundColor: paper.rgb,
  paddingInline: contentSidePaddingWithNavigation(8),
  paddingTop: rem(40),
});

const headerStyles = css({
  display: 'flex',
  gap: rem(8),
  marginBottom: rem(24),
  flexWrap: 'wrap',
});

const titleStyles = css({
  marginBottom: rem(24),
});

const actionsContainerStyles = css({
  display: 'flex',
  gap: rem(12),
  marginBottom: rem(24),
  flexWrap: 'wrap',
  alignItems: 'center',
});

const contactButtonStyles = css({
  display: 'flex',
  gap: rem(8),
  alignItems: 'center',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    width: '100%',
  },
});

const driveButtonStyles = css({
  width: 'fit-content',
  paddingBottom: rem(24),
});

const buttonStyles = css({
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'flex',
    flexGrow: 1,
  },
});

const metadataStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  marginBottom: rem(12),
});

const metadataRowStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(8),
  fontSize: rem(17),
  color: lead.rgb,
});
const iconContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const iconStyles = css({
  display: 'inline-flex',
  width: rem(24),
  height: rem(24),
  flexShrink: 0,
  '& svg': {
    width: '100%',
    height: '100%',
  },
});

const teamLinkStyles = css({
  color: '#00A650',
  fontWeight: 500,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const discoveryProjectDurationStyles = css({
  marginLeft: rem(16),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    marginLeft: 0,
    width: '100%',
  },
});

const discoveryDurationMediaStyles = css({
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    marginLeft: 0,
    flexDirection: 'column',
    gap: rem(16),
  },
});

// not used yet - will be included when sharing outputs is implemented
// const dropdownButtonStyling = css({
//   display: 'flex',
//   columnGap: rem(8),
// });

type ProjectDetailHeaderProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly aboutHref: string;
};

export const getTeamIcon = (project: ProjectDetail) => {
  if (project.projectType === 'Discovery') {
    return <DiscoveryTeamIcon />;
  }
  if (project.projectType === 'Resource' && project.isTeamBased) {
    return <ResourceTeamIcon />;
  }
  if (project.projectType === 'Resource' && !project.isTeamBased) {
    return <ResourceMemberIcon />;
  }
  if (project.projectType === 'Trainee') {
    return <TrainerIcon />;
  }
  return null;
};

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = (project) => {
  const { pointOfContactEmail, aboutHref } = project;

  const getMemberIcon = () => {
    if (project.projectType === 'Trainee') {
      return <MemberIcon />;
    }
    // istanbul ignore next - only used for Trainee projects
    return null;
  };

  return (
    <header css={containerStyles}>
      {/* Status and Type Pills */}
      <div css={headerStyles}>
        <Pill accent={getStatusPillAccent(project.status)} noMargin>
          {project.status}
        </Pill>
        <Pill noMargin>{getProjectTypeLabel(project.projectType)}</Pill>
        {project.projectType === 'Discovery' && (
          <Pill noMargin>{project.researchTheme}</Pill>
        )}
        {project.projectType === 'Resource' && (
          <Pill noMargin>{project.resourceType}</Pill>
        )}
      </div>

      {/* Title */}
      <div css={titleStyles}>
        <Display styleAsHeading={2}>{project.title}</Display>
      </div>

      {/* Action Buttons */}
      <div css={actionsContainerStyles}>
        {pointOfContactEmail && (
          <div css={contactButtonStyles}>
            <span css={buttonStyles}>
              <Link
                buttonStyle
                small
                primary
                href={createMailTo(pointOfContactEmail)}
                noMargin
              >
                Contact
              </Link>
            </span>
            <CopyButton
              hoverTooltipText="Copy Email"
              clickTooltipText="Email Copied"
              onClick={() => navigator.clipboard.writeText(pointOfContactEmail)}
            />
          </div>
        )}

        {/* Share Output button for Discovery projects - not included yet */}
        {/* {project.projectType === 'Discovery' && (
            <div css={css({ marginLeft: 'auto' })}>
              <DropdownButton
                noMargin
                buttonChildren={() => (
                  <span css={dropdownButtonStyling}>
                    {plusIcon}
                    Share an Output
                  </span>
                )}
                primary
              >
                {{
                  item: <>Article</>,
                  href: '#',
                }}
                {{
                  item: <>Dataset</>,
                  href: '#',
                }}
                {{
                  item: <>Protocol</>,
                  href: '#',
                }}
              </DropdownButton>
            </div>
          )} */}
      </div>

      {/* Access Drive for Resource projects */}
      {project.projectType === 'Resource' && project.googleDriveLink && (
        <div css={driveButtonStyles}>
          <Link href={project.googleDriveLink} buttonStyle small noMargin>
            {googleDriveIcon} Access Drive
          </Link>
        </div>
      )}
      {/* Metadata Section */}
      <div css={metadataStyles}>
        {/* Team/Members Info */}
        {project.projectType === 'Discovery' && (
          <div css={[metadataRowStyles, discoveryDurationMediaStyles]}>
            <div css={iconContainerStyles}>
              <span css={iconStyles}>{getTeamIcon(project)}</span>
              {project.teamId ? (
                <Link href={`/teams/${project.teamId}`}>
                  <span css={teamLinkStyles}>{project.teamName}</span>
                </Link>
              ) : (
                <span css={teamLinkStyles}>{project.teamName}</span>
              )}
            </div>
            <div css={discoveryProjectDurationStyles}>
              <ProjectDuration
                startDate={project.startDate}
                endDate={project.endDate}
              />
            </div>
          </div>
        )}

        {project.projectType === 'Resource' &&
          project.isTeamBased &&
          project.teamName && (
            <div css={metadataRowStyles}>
              <span css={iconStyles}>{getTeamIcon(project)}</span>
              {project.teamId ? (
                <Link href={`/teams/${project.teamId}`}>
                  <span css={teamLinkStyles}>{project.teamName}</span>
                </Link>
              ) : (
                <span css={teamLinkStyles}>{project.teamName}</span>
              )}
              {project.isTeamBased && (
                <div css={discoveryProjectDurationStyles}>
                  <ProjectDuration
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                </div>
              )}
            </div>
          )}

        {project.projectType === 'Resource' &&
          !project.isTeamBased &&
          project.members && (
            <div css={metadataRowStyles}>
              <span css={iconStyles}>{getTeamIcon(project)}</span>
              <UsersList users={project.members} separator="•" noMargin />
            </div>
          )}

        {project.projectType === 'Trainee' && (
          <>
            <div css={metadataRowStyles}>
              <span css={iconStyles}>{getTeamIcon(project)}</span>
              <UsersList users={[project.trainer]} separator="•" noMargin />
            </div>
            <div css={metadataRowStyles}>
              <span css={iconStyles}>{getMemberIcon()}</span>
              <UsersList users={project.members} separator="•" noMargin />
            </div>
          </>
        )}

        {/* Duration */}
        {(project.projectType === 'Trainee' ||
          (project.projectType === 'Resource' && !project.isTeamBased)) && (
          <ProjectDuration
            startDate={project.startDate}
            endDate={project.endDate}
          />
        )}
      </div>
      <TabNav>
        <TabLink href={aboutHref}>About</TabLink>
      </TabNav>
    </header>
  );
};

export default ProjectDetailHeader;
