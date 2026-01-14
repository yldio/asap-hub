import React, { useState } from 'react';
import { UserProjectMembership, ProjectStatus } from '@asap-hub/model';
import { projects as projectRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Paragraph, Button, Headline2, Anchor, Pill } from '../atoms';
import { charcoal, fern, lead, steel } from '../colors';
import { rem } from '../pixels';
import { getStatusPillAccent } from './ProjectCard';

const MAX_PROJECTS = 6;

const headerStyles = css({
  marginBottom: rem(24),
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
});

const tableHeaderStyles = css({
  textAlign: 'left',
  fontSize: rem(17),
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '24px',
  letterSpacing: '0.1px',
  color: charcoal.rgb,
});

const tableCellStyles = css({
  padding: `${rem(16)} 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  verticalAlign: 'top',
});

const projectNameStyles = css({
  fontSize: rem(16),
  fontWeight: '500',
  color: fern.rgb,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const typeLabelStyles = css({
  fontSize: rem(14),
  color: lead.rgb,
});

const showMoreButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontWeight: 'normal',
  color: fern.rgba,
  paddingTop: rem(24),
  paddingBottom: rem(24),

  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const showMoreButtonTextStyles = css({
  height: rem(24),
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
});

type UserProjectsCardProps = {
  projects: UserProjectMembership[];
};

const UserProjectsCard: React.FC<UserProjectsCardProps> = ({ projects }) => {
  const [showMore, setShowMore] = useState(false);

  const getProjectRoute = (project: UserProjectMembership) => {
    if (project.projectType === 'Discovery Project') {
      return projectRoutes({})
        .discoveryProjects({})
        .discoveryProject({ projectId: project.id }).$;
    }
    if (project.projectType === 'Resource Project') {
      return projectRoutes({})
        .resourceProjects({})
        .resourceProject({ projectId: project.id }).$;
    }
    if (project.projectType === 'Trainee Project') {
      return projectRoutes({})
        .traineeProjects({})
        .traineeProject({ projectId: project.id }).$;
    }
    // Unknown project type
    return undefined;
  };

  const displayProjects = showMore ? projects : projects.slice(0, MAX_PROJECTS);
  const hasMoreProjects = projects.length > MAX_PROJECTS;

  if (projects.length === 0) {
    return (
      <Card>
        <div css={headerStyles}>
          <Headline2 styleAsHeading={3}>Projects</Headline2>
        </div>
        <Paragraph accent="lead">
          This user is not currently assigned to any projects.
        </Paragraph>
      </Card>
    );
  }

  return (
    <Card>
      <div css={headerStyles}>
        <Headline2 styleAsHeading={3}>Projects</Headline2>
        <Paragraph accent="lead">
          Explore all projects this user has contributed to.
        </Paragraph>
      </div>

      <table css={tableStyles}>
        <thead>
          <tr>
            <th css={tableHeaderStyles}>Project Name</th>
            <th css={tableHeaderStyles}>Type</th>
            <th css={tableHeaderStyles}>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayProjects.map((project) => {
            const projectRoute = getProjectRoute(project);

            return (
              <tr key={project.id}>
                <td css={tableCellStyles}>
                  {projectRoute ? (
                    <Anchor href={projectRoute} css={projectNameStyles}>
                      {project.title}
                    </Anchor>
                  ) : (
                    <span css={projectNameStyles}>{project.title}</span>
                  )}
                </td>
                <td css={tableCellStyles}>
                  <span css={typeLabelStyles}>{project.projectType}</span>
                </td>
                <td css={tableCellStyles}>
                  {project.status && (
                    <Pill
                      accent={getStatusPillAccent(
                        project.status as ProjectStatus,
                      )}
                      noMargin
                    >
                      {project.status}
                    </Pill>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {hasMoreProjects && (
        <Button
          linkStyle
          onClick={() => setShowMore(!showMore)}
          overrideStyles={showMoreButtonStyles}
        >
          <span css={showMoreButtonTextStyles}>
            {showMore ? 'Show less ↑' : 'Show more ↓'}
          </span>
        </Button>
      )}
    </Card>
  );
};

export default UserProjectsCard;
