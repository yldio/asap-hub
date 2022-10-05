import { gp2 } from '@asap-hub/model';
import {
  crossQuery,
  ExternalLink,
  Paragraph,
  Pill,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';

const { rem, perRem } = pixels;

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
  },
});

type ProjectMilestoneProps = {
  milestone: gp2.ProjectResponse['milestones'][0];
};

type MileStoneStatus = gp2.ProjectResponse['milestones'][0]['status'];

export const statusStyles: Record<
  MileStoneStatus,
  { color: string; borderColor: string }
> = {
  Active: {
    color: colors.info900.rgba,
    borderColor: colors.info900.rgba,
  },
  Completed: {
    color: colors.success900.rgba,
    borderColor: colors.success900.rgba,
  },
  'Not Started': {
    color: colors.error900.rgba,
    borderColor: colors.error900.rgba,
  },
};
const styles = css({
  marginTop: `${48 / perRem}em`,
});

const ProjectMilestone: React.FC<ProjectMilestoneProps> = ({ milestone }) => (
  <div css={styles}>
    <div css={[rowStyles, css({ gap: rem(4) })]}>
      <div css={css({ display: 'inline-flex' })}>
        <Pill
          overrideStyles={css({ ...statusStyles[milestone.status], margin: 0 })}
        >
          {milestone.status}
        </Pill>
      </div>
      {milestone.link && (
        <div
          css={css({
            [crossQuery]: {
              marginLeft: 'auto',
            },
          })}
        >
          <ExternalLink
            href={milestone.link}
            label="View Milestone"
            noMargin
            full
          />
        </div>
      )}
    </div>
    <div css={styles}>
      <Subtitle hasMargin={false}>{milestone.title}</Subtitle>
      {milestone.description && (
        <Paragraph hasMargin={false} accent="lead">
          {milestone.description}
        </Paragraph>
      )}
    </div>
  </div>
);

export default ProjectMilestone;
