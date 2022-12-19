import { gp2 } from '@asap-hub/model';
import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  lead,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import { StatusPill } from '../molecules';
import colors from '../templates/colors';

const { rem, tabletScreen } = pixels;

const contentStyles = css({
  padding: `${rem(16)} 0`,
});
const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
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
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'flex',
  },
});
const headingTopMainStyles = css({
  flex: '40% 0 0',
});
const headinTopSecondaryStyles = css({
  flex: '30% 0 0',
});
const listElementStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '32px',
  marginBottom: rem(8),
});
const listElementMainStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flex: '40% 0 0',
  },
});
const listElementSecondaryStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flex: '30% 0 0',
  },
});
const headingListStyles = css({
  margin: '0',
  flex: '30% 0 0',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
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
        <h4 css={headingTopMainStyles}>Name</h4>
        <h4 css={headinTopSecondaryStyles}>Role</h4>
        <h4 css={headinTopSecondaryStyles}>Status</h4>
      </div>
      {projects.map((project, index) => (
        <div key={`user-project-${index}`} css={getProjectListStyles()}>
          <div css={[listElementStyles, listElementMainStyles]}>
            <h4 css={headingListStyles}>Name:</h4>
            <Link href="https://google.com">{project.title}</Link>
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
