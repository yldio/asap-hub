import { Aim as AimType, AimStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { lead, info100, info500, steel } from '../colors';
import { plusRectIcon, minusRectIcon } from '../icons';
import { useTextTruncation } from '../hooks';
import {
  descriptionContainerStyles,
  mobileLabelStyles,
  clampedDescriptionStyles,
  readMoreButtonStyles,
  statusContainerStyles,
  getStatusAccent,
} from './shared-aim-milestones-styles';

export const AIM_TEMPLATE_COLUMNS = `33px 1fr 120px`;
export const AIM_COLUMN_GAP = 24;

const aimRowStyles = css({
  display: 'grid',
  gridTemplateColumns: AIM_TEMPLATE_COLUMNS,
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
    gap: rem(16),
    justifyContent: 'flex-start',
    flexFlow: 'column',
    marginBottom: rem(24),
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
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    marginTop: rem(24),
    marginBottom: rem(24),
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

export const getAimStatusAccent = (status: AimStatus) =>
  getStatusAccent(status);

type AimProps = {
  aim: AimType;
};

const Aim: FC<AimProps> = ({ aim }) => {
  const { ref, isExpanded, needsExpansion, toggle } = useTextTruncation(
    aim.description,
  );
  const [articlesExpanded, setArticlesExpanded] = useState(false);

  return (
    <div css={aimRowStyles}>
      <div css={aimNumberContainerStyles}>
        <div css={mobileLabelStyles}>Aim</div>
        <span css={aimNumberBadgeStyles}>#{aim.order}</span>
      </div>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Description</div>
        <div ref={ref} css={clampedDescriptionStyles(isExpanded)}>
          {aim.description}
        </div>
        {needsExpansion && (
          <button css={readMoreButtonStyles} onClick={toggle} type="button">
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
