import { Aim as AimType, AimStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState, useEffect, useRef } from 'react';
import { Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { lead, neutral1000, fern, info100, info500, steel } from '../colors';
import { plusRectIcon, minusRectIcon } from '../icons';

export const AIM_COLUMN_GAP = 24;

const aimRowStyles = css({
  display: 'grid',
  gridTemplateColumns: '48px 1fr 120px',
  gap: rem(AIM_COLUMN_GAP),
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

const aimNumberContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'start',
  placeSelf: 'start',
  justifyContent: 'center',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    justifyContent: 'flex-start',
  },
});

const aimNumberBadgeStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: info100.rgb,
  color: info500.rgb,
  fontSize: rem(14),
  borderRadius: rem(12),
  height: rem(24),
  padding: `0 ${rem(8)}`,
  whiteSpace: 'nowrap',
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
  color: fern.rgb,
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

const articlesButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginTop: rem(16),
  color: lead.rgb,
  fontSize: rem(17),
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const articleIconStyles = css({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    width: rem(20),
    height: rem(20),
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

export const getAimStatusAccent = (
  status: AimStatus,
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

type AimProps = {
  aim: AimType;
};

const Aim: FC<AimProps> = ({ aim }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (descriptionRef.current) {
        const wasExpanded = isExpanded;
        if (wasExpanded) {
          descriptionRef.current.style.display = '-webkit-box';
          descriptionRef.current.style.webkitLineClamp = '2';
          descriptionRef.current.style.webkitBoxOrient = 'vertical';
          descriptionRef.current.style.overflow = 'hidden';
        }

        const isTruncated =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;

        if (wasExpanded) {
          descriptionRef.current.style.display = '';
          descriptionRef.current.style.webkitLineClamp = '';
          descriptionRef.current.style.webkitBoxOrient = '';
          descriptionRef.current.style.overflow = '';
        }

        setNeedsExpansion(isTruncated);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [aim.description, isExpanded]);

  return (
    <div css={aimRowStyles}>
      <div css={aimNumberContainerStyles}>
        <div css={mobileLabelStyles}>Aim</div>
        <span css={aimNumberBadgeStyles}>#{aim.order}</span>
      </div>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Description</div>
        <div ref={descriptionRef} css={descriptionStyles(isExpanded)}>
          {aim.description}
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
        {aim.articleCount > 0 && (
          <button
            css={articlesButtonStyles}
            onClick={() => setArticlesExpanded(!articlesExpanded)}
            type="button"
          >
            <span css={articleIconStyles}>
              {articlesExpanded ? minusRectIcon : plusRectIcon}
            </span>
            <span>Articles ({aim.articleCount})</span>
          </button>
        )}
      </div>
      <div css={statusContainerStyles}>
        <div css={mobileLabelStyles}>Status</div>
        <Pill accent={getAimStatusAccent(aim.status)} noMargin>
          {aim.status}
        </Pill>
      </div>
    </div>
  );
};

export default Aim;
