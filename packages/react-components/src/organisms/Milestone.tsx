import { Milestone as MilestoneType, MilestoneStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState, useEffect, useRef } from 'react';
import { Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { lead, neutral1000 } from '../colors';

const milestoneRowStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 120px',
  gap: rem(24),
  paddingBottom: rem(20),
  borderBottom: `1px solid #E9ECEF`,
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

const descriptionContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  justifyContent: 'flex-start',
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
    color: lead.rgb,
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
  color: '#00A650',
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
    case 'Incomplete':
      return 'warning';
    case 'Not Started':
      return 'error';
    default:
      return 'default';
  }
};

type MilestoneProps = {
  milestone: MilestoneType;
};

const Milestone: FC<MilestoneProps> = ({ milestone }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (descriptionRef.current) {
        // Temporarily force collapsed state to check if truncation occurs
        const wasExpanded = isExpanded;
        if (wasExpanded) {
          // Temporarily collapse to check
          descriptionRef.current.style.display = '-webkit-box';
          descriptionRef.current.style.webkitLineClamp = '2';
          descriptionRef.current.style.webkitBoxOrient = 'vertical';
          descriptionRef.current.style.overflow = 'hidden';
        }

        // Check if content is truncated by comparing scroll height with client height
        const isTruncated =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;

        // Restore expanded state if needed
        if (wasExpanded) {
          descriptionRef.current.style.display = '';
          descriptionRef.current.style.webkitLineClamp = '';
          descriptionRef.current.style.webkitBoxOrient = '';
          descriptionRef.current.style.overflow = '';
        }

        setNeedsExpansion(isTruncated);
      }
    };

    // Check on mount and when description changes
    checkTruncation();

    // Add resize listener to check when window is resized
    window.addEventListener('resize', checkTruncation);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [milestone.description, isExpanded]);

  return (
    <div css={milestoneRowStyles}>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Description</div>
        <div ref={descriptionRef} css={descriptionStyles(isExpanded)}>
          {milestone.description}
        </div>
        {needsExpansion && (
          <button
            css={readMoreButtonStyles}
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
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
