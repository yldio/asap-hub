import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  Headline4,
  lead,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import { nonMobileQuery } from '../layout';
import { StatusPill } from '../molecules';
import colors from '../templates/colors';

const { rem } = pixels;

const contentStyles = css({
  rowGap: `${rem(16)} 0`,
});
const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  [nonMobileQuery]: {
    display: 'flex',
  },
});
const textStyles = css({
  color: lead.rgb,
});
const hideStyles = css({
  [`:nth-of-type(n+6)`]: { display: 'none' },
});
const headingTopStyles = css({
  display: 'none',
  [nonMobileQuery]: {
    display: 'flex',
  },
  '*:first-child': {
    flex: '40% 0 0',
  },
  '& > *': {
    flex: '30% 0 0',
  },
});
const listElementStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(32),
  marginBottom: rem(8),
});
const listElementMainStyles = css({
  [nonMobileQuery]: {
    flex: '40% 0 0',
  },
});
const listElementSecondaryStyles = css({
  [nonMobileQuery]: {
    flex: '30% 0 0',
  },
});
const headingListStyles = css({
  margin: '0',
  flex: '30% 0 0',
  [nonMobileQuery]: {
    display: 'none',
  },
});
const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});

type UserProjectsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'projects'
>;
const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstName,
  id,
}) => {
  const minimumProjectsToDisplay = 3;
  const [expanded, setExpanded] = useState(false);

  const getProjectListStyles = () => {
    if (projects.length < minimumProjectsToDisplay + 1 || expanded) {
      return rowStyles;
    }

    return [rowStyles, hideStyles];
  };

  const getUserProjectRole = (
    userId: gp2.UserResponse['id'],
    project: gp2.UserResponse['projects'][number],
  ): gp2.ProjectMemberRole | null =>
    project.members.find((member) => member.userId === userId)?.role || null;

  return (
    <>
      <div css={[contentStyles]}>
        <Paragraph hasMargin={false} accent="lead">
          {firstName} has been involved in the following GP2 projects:
        </Paragraph>
      </div>
      <div css={headingTopStyles}>
        <Headline4>Name</Headline4>
        <Headline4>Role</Headline4>
        <Headline4>Status</Headline4>
      </div>
      {projects.map((project) => (
        <div key={`user-project-${project.id}`} css={getProjectListStyles()}>
          <div css={[listElementStyles, listElementMainStyles]}>
            <h4 css={headingListStyles}>Name:</h4>
            <Link
              underlined
              href={
                gp2Routing.projects({}).project({
                  projectId: project.id,
                }).$
              }
            >
              {project.title}
            </Link>
          </div>
          <div css={[listElementStyles, listElementSecondaryStyles]}>
            <h4 css={headingListStyles}>Role:</h4>
            <span css={textStyles}>{getUserProjectRole(id, project)}</span>
          </div>
          <div css={[listElementStyles, listElementSecondaryStyles]}>
            <h4 css={headingListStyles}>Status:</h4>
            <StatusPill status={project.status} />
          </div>
        </div>
      ))}
      {projects.length > minimumProjectsToDisplay && (
        <div css={buttonWrapperStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            <span
              css={{
                display: 'inline-grid',
                verticalAlign: 'middle',
                paddingRight: rem(12),
              }}
            >
              {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
            </span>
            Show {expanded ? 'less' : 'more'}
          </Button>
        </div>
      )}
    </>
  );
};

export default UserProjects;
