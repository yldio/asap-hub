import { Milestone as MilestoneType, MilestoneStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';
import { Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { steel, neutral1000, info100, info500, success500 } from '../colors';
import { useTextTruncation } from '../hooks';

function parseAimsString(aims: string | undefined): number[] {
  if (!aims || typeof aims !== 'string') return [];
  return aims
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

const milestoneRowStyles = css({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  paddingBottom: rem(20),
  borderBottom: `1px solid ${steel.rgb}`,
  marginBottom: rem(20),
  alignItems: 'flex-start',
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

const aimsColumnStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
  alignItems: 'center',
  paddingBlock: rem(4),
});

const aimBadgeStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: info100.rgb,
  color: info500.rgb,
  fontSize: rem(14),
  padding: `${rem(2)} ${rem(6)}`,
  lineHeight: rem(16),
  borderRadius: rem(24),
  height: rem(24),
  width: rem(32),
  whiteSpace: 'nowrap',
});

const descriptionContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  justifyContent: 'flex-start',
  minWidth: 0,
  color: neutral1000.rgb,
});

const mobileLabelStyles = css({
  fontSize: rem(17),
  fontWeight: 'bold',
  color: neutral1000.rgb,
  marginBottom: rem(8),
  display: 'none',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'block',
  },
});

const descriptionStyles = (isExpanded: boolean) =>
  css({
    color: neutral1000.rgb,
    fontSize: rem(17),
    lineHeight: rem(24),
    margin: 0,
    ...(isExpanded
      ? {}
      : {
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
  });

const readMoreButtonStyles = css({
  background: 'none',
  border: 'none',
  color: success500.rgb,
  cursor: 'pointer',
  padding: 0,
  fontSize: rem(17),
  fontWeight: 400,
  display: 'inline',
  textAlign: 'left',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const statusContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingBlock: rem(4),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    flexDirection: 'column',
    paddingBlock: 0,
  },
});

export const getMilestoneStatusAccent = (
  status: MilestoneStatus,
): 'success' | 'info' | 'neutral' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'Complete':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Pending':
      return 'neutral';
    case 'Terminated':
      return 'error';
    default:
      return 'default';
  }
};

type MilestoneProps = {
  milestone: MilestoneType;
};

const Milestone: FC<MilestoneProps> = ({ milestone }) => {
  const { ref, isExpanded, needsExpansion, toggle } = useTextTruncation(
    milestone.description,
  );

  const aimNumbers = parseAimsString(milestone.aims);

  return (
    <div css={milestoneRowStyles}>
      <div css={aimsColumnStyles}>
        <div css={mobileLabelStyles}>Aims</div>
        {aimNumbers.length > 0 &&
          aimNumbers.map((n) => (
            <span key={n} css={aimBadgeStyles}>
              #{n}
            </span>
          ))}
      </div>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Milestone</div>
        <div ref={ref} css={descriptionStyles(isExpanded)}>
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
