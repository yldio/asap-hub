import { css } from '@emotion/react';
import { Subtitle } from '../atoms';
import { lead } from '../colors';
import {
  happyFaceIcon,
  informationInverseIcon,
  neutralFaceIcon,
  sadFaceIcon,
} from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { rem, smallDesktopScreen } from '../pixels';
import CaptionCard from './CaptionCard';

const containerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, auto)',
  columnGap: 'clamp(12px, 78px, 78px)',
  rowGap: rem(16),
  [`@media (max-width: calc(${
    smallDesktopScreen.width
  }px + 220px + ${contentSidePaddingWithNavigation(2)}))`]: {
    gridTemplateColumns: 'repeat(2, auto)',
  },
});

const dataContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(4),
  textWrap: 'nowrap',
});

const dataTextStyles = css({
  fontWeight: 400,
  fontSize: rem(17),
  textWrap: 'nowrap',
  color: lead.rgb,
});

const StaticPerformanceCard: React.FC = () => (
  <CaptionCard>
    <div css={containerStyles}>
      <div css={dataContainerStyles}>
        {happyFaceIcon}
        <Subtitle noMargin>Outstanding:</Subtitle>
        <span css={dataTextStyles}>&ge; 90%</span>
      </div>
      <div css={dataContainerStyles}>
        {neutralFaceIcon}
        <Subtitle noMargin>Adequate:</Subtitle>
        <span css={dataTextStyles}>80% - 89%</span>
      </div>
      <div css={dataContainerStyles}>
        {sadFaceIcon}
        <Subtitle noMargin>Needs Improvement:</Subtitle>
        <span css={dataTextStyles}>&lt; 80%</span>
      </div>
      <div css={dataContainerStyles}>
        {informationInverseIcon}
        <Subtitle noMargin>Limited data</Subtitle>
      </div>
    </div>
  </CaptionCard>
);

export default StaticPerformanceCard;
