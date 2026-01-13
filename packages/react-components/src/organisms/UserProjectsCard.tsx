import React, { useState } from 'react';
import { UserProjectMembership } from '@asap-hub/model';
import { projects as projectRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Paragraph, Button, Headline2, Anchor } from '../atoms';
import { fern } from '../colors';
import { rem } from '../pixels';

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
  fontSize: '17px',
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '24px',
  letterSpacing: '0.1px',
  color: '#00202C',
  fontFeatureSettings: "'liga' off, 'clig' off",
});

const tableCellStyles = css({
  padding: `${rem(16)} 0`,
  borderBottom: '1px solid #E5E5E5',
  verticalAlign: 'top',
});

const projectNameStyles = css({
  fontSize: '1rem',
  fontWeight: '500',
  color: fern.rgb,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const typeLabelStyles = css({
  fontSize: '0.875rem',
  color: '#708090',
});

const activeBadgeStyles = css({
  display: 'flex',
  width: '55px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  border: '1px solid #0C8DC3',
  background: '#E6F3F9',
  color: '#0C8DC3',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '16px',
  height: '24px',
});

const completeBadgeStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  border: '1px solid #34A270',
  background: '#E4F5EE',
  color: '#34A270',
  fontFamily: 'Roboto',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '16px',
  height: '24px',
  maxWidth: '77px',
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
            const isActive = project.status === 'Active';
            const isCompleted =
              project.status === 'Completed' || project.status === 'Closed';

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
                  {isActive && (
                    <span css={activeBadgeStyles}>{project.status}</span>
                  )}
                  {isCompleted && (
                    <span css={completeBadgeStyles}>Complete</span>
                  )}
                  {!isActive && !isCompleted && (
                    <span css={completeBadgeStyles}>{project.status}</span>
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
