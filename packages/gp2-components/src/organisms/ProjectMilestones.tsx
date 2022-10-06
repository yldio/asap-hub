import { gp2 } from '@asap-hub/model';
import { Headline3, Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';
import ProjectMilestone from './ProjectMilestone';

const { rem } = pixels;

type ProjectMilestonesProps = {
  milestones: gp2.ProjectResponse['milestones'];
};

const contentStyles = css({
  padding: `${rem(24)} 0`,
});

const rowStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  paddingBottom: rem(12),
  marginBottom: rem(12),
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
});

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  milestones,
}) => (
  <>
    <Headline3 noMargin>Project Milestones ({milestones.length})</Headline3>
    <div css={[contentStyles]}>
      <Paragraph hasMargin={false} accent="lead">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat
      </Paragraph>
    </div>
    {milestones.map((milestone) => (
      <div css={[rowStyles]}>
        <ProjectMilestone milestone={milestone} />
      </div>
    ))}
  </>
);

export default ProjectMilestones;
