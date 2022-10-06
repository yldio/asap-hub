import { gp2 } from '@asap-hub/model';
import {
  crossQuery,
  ExternalLink,
  Paragraph,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import StatusPill from '../molecules/StatusPill';

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

const styles = css({
  marginTop: `${48 / perRem}em`,
});

const ProjectMilestone: React.FC<ProjectMilestoneProps> = ({ milestone }) => (
  <div css={styles}>
    <div css={[rowStyles, css({ gap: rem(4) })]}>
      <div css={css({ display: 'inline-flex' })}>
        <StatusPill status={milestone.status} />
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
