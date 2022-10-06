import { gp2 } from '@asap-hub/model';
import { Headline3, Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ProjectMilestone from './ProjectMilestone';

const { rem } = pixels;

type ProjectMilestonesProps = {
  milestones: gp2.ProjectResponse['milestones'];
};

const contentStyles = css({
  marginTop: rem(32),
});
const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  milestones,
}) => (
  <>
    <Headline3 noMargin>Project Milestones ({milestones.length})</Headline3>
    <Paragraph hasMargin={false} accent="lead">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat
    </Paragraph>
    <div css={contentStyles}>
      {milestones.map((milestone) => (
        <ProjectMilestone milestone={milestone} />
      ))}
    </div>
  </>
);

export default ProjectMilestones;
