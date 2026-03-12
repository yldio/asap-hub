import { Milestone as MilestoneType } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';
import { Card } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import Milestone from './Milestone';
import { neutral1000, steel } from '../colors';

const contentStyles = css({
  padding: rem(24),
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
});

const tableHeaderStyles = css({
  display: 'grid',
  gridTemplateColumns: '150px 1fr 120px',
  gap: rem(24),
  marginBottom: rem(16),
  paddingBottom: rem(16),
  borderBottom: `1px solid ${steel.rgb}`,
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'none',
  },
});

const headerLabelStyles = css({
  fontSize: rem(17),
  fontWeight: 'bold',
  color: neutral1000.rgb,
});

const aimsHeaderStyles = css({
  flexShrink: 0,
});

const milestoneHeaderStyles = css({
  flex: 1,
  minWidth: 0,
});

const statusHeaderStyles = css({
  flexShrink: 0,
});

const milestonesListStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

type ProjectMilestonesProps = {
  milestones: ReadonlyArray<MilestoneType>;
};

const ProjectMilestones: FC<ProjectMilestonesProps> = ({ milestones }) => {
  if (!milestones.length) {
    return null;
  }

  return (
    <Card padding={false}>
      <div css={contentStyles}>
        <div css={tableHeaderStyles}>
          <div css={[headerLabelStyles, aimsHeaderStyles]}>Aims</div>
          <div css={[headerLabelStyles, milestoneHeaderStyles]}>Milestone</div>
          <div css={[headerLabelStyles, statusHeaderStyles]}>Status</div>
        </div>
        <div css={milestonesListStyles}>
          {milestones.map((milestone) => (
            <Milestone key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProjectMilestones;
