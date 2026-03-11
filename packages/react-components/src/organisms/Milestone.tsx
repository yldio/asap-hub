import { Milestone as MilestoneType, MilestoneStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';
import { Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { steel } from '../colors';
import { useTextTruncation } from '../hooks';
import {
  descriptionContainerStyles,
  mobileLabelStyles,
  clampedDescriptionStyles,
  readMoreButtonStyles,
  statusContainerStyles,
  getStatusAccent,
} from './shared-aim-milestones-styles';

const milestoneRowStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 120px',
  gap: rem(24),
  paddingBottom: rem(20),
  borderBottom: `1px solid ${steel.rgb}`,
  marginBottom: rem(20),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gridTemplateColumns: '1fr',
    gap: rem(12),
  },
  '&:last-child': {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
});

export const getMilestoneStatusAccent = (status: MilestoneStatus) =>
  getStatusAccent(status);

type MilestoneProps = {
  milestone: MilestoneType;
};

const Milestone: FC<MilestoneProps> = ({ milestone }) => {
  const { ref, isExpanded, needsExpansion, toggle } = useTextTruncation(
    milestone.description,
  );

  return (
    <div css={milestoneRowStyles}>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Description</div>
        <div ref={ref} css={clampedDescriptionStyles(isExpanded)}>
          {milestone.description}
        </div>
        {needsExpansion && (
          <button css={readMoreButtonStyles} onClick={toggle} type="button">
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <div css={statusContainerStyles}>
        <div css={mobileLabelStyles}>Status</div>
        <Pill accent={getMilestoneStatusAccent(milestone.status)} noMargin>
          {milestone.status}
        </Pill>
      </div>
    </div>
  );
};

export default Milestone;
