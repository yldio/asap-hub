import React, { useState } from 'react';
import { Project } from '@asap-hub/model';
import { projects as projectRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Paragraph, Link, Button } from '../atoms';
import { fern } from '../colors';
import { rem } from '../pixels';

const MAX_PROJECTS = 6;

const containerStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const headerStyles = css({
  marginBottom: rem(24),
});

const titleStyles = css({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  margin: 0,
  marginBottom: rem(8),
});

const subtitleStyles = css({
  color: '#708090',
  fontSize: '0.875rem',
  margin: 0,
  lineHeight: 1.4,
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
});

const tableHeaderStyles = css({
  textAlign: 'left',
  padding: `${rem(12)} ${rem(16)}`,
  fontSize: '17px',
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '24px',
  letterSpacing: '0.1px',
  color: '#00202C',
  fontFeatureSettings: "'liga' off, 'clig' off",
  borderBottom: '1px solid #D6D6D6',
});

const tableCellStyles = css({
  padding: `${rem(16)}`,
  borderBottom: '1px solid #E5E5E5',
  verticalAlign: 'top',
});

const projectNameStyles = css({
  fontSize: '1rem',
  fontWeight: '500',
  color: '#2B388F',
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

const arrowIconStyles = css({
  alignSelf: 'start',
});

type UserProjectsCardProps = {
  projects: Project[];
};

const UserProjectsCard: React.FC<UserProjectsCardProps> = ({ projects }) => {
  const [showMore, setShowMore] = useState(false);

  const getProjectRoute = (project: Project) => {
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
    // Trainee projects don't have individual pages
    return undefined;
  };

  const displayProjects = showMore ? projects : projects.slice(0, MAX_PROJECTS);
  const hasMoreProjects = projects.length > MAX_PROJECTS;

  if (projects.length === 0) {
    return (
      <Card>
          <div css={headerStyles}>
            <h3 css={titleStyles}>Projects</h3>
          </div>
          <Paragraph accent="lead">
            This user is not currently assigned to any projects.
          </Paragraph>
      </Card>
    );
  }

  return (
    <Card>
      <div css={containerStyles}>
        <div css={headerStyles}>
          <h3 css={titleStyles}>Projects</h3>
          <p css={subtitleStyles}>
            Explore all projects this user has contributed to.
          </p>
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
              const isCompleted = project.status === 'Completed' || project.status === 'Closed';

              return (
                <tr key={project.id}>
                  <td css={tableCellStyles}>
                    {projectRoute ? (
                      <Link href={projectRoute} css={projectNameStyles}>
                        {project.title}
                      </Link>
                    ) : (
                      <span css={projectNameStyles}>{project.title}</span>
                    )}
                  </td>
                  <td css={tableCellStyles}>
                    <span css={typeLabelStyles}>{project.projectType}</span>
                  </td>
                  <td css={tableCellStyles}>
                    {isActive && (
                      <span css={activeBadgeStyles}>Active</span>
                    )}
                    {isCompleted && (
                      <span css={completeBadgeStyles}>Complete</span>
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
              {showMore ? `Show less ↑` : `Show more ↓`}
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserProjectsCard;
