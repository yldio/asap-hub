import { css } from '@emotion/react';
import CaptionCard from './CaptionCard';
import { contentSidePaddingWithNavigation } from '../layout';
import { rem, smallDesktopScreen } from '../pixels';
import { lead } from '../colors';
import { Paragraph, Subtitle } from '../atoms';
import {
  happyFaceIcon,
  informationInverseIcon,
  neutralFaceIcon,
  PercentageIcon,
  sadFaceIcon,
} from '../icons';

const containerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gridColumn: '1 / span 2',
  paddingRight: rem(48),
  [`@media (max-width: calc(${
    smallDesktopScreen.width
  }px + ${contentSidePaddingWithNavigation(2)}))`]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: rem(12),
    justifyContent: 'stretch',
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

const captionLegendStyles = css({
  gridColumn: '1 / span 2',
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(4),
});

const iconContainerStyles = css({
  flexShrink: 0,
});

const paragraphContainerStyles = css({
  flex: 1,
  minWidth: 0,
});

const OpensciencePerformanceCard = ({
  outstanding = 90,
  adequate = 80,
  needsImprovement = 80,
  limitedData = 0,
  legend,
}: {
  outstanding?: number;
  adequate?: number;
  needsImprovement?: number;
  limitedData?: number;
  legend?: string;
}) => {
  return (
    <CaptionCard>
      <div css={containerStyles}>
        <div css={dataContainerStyles}>
          {happyFaceIcon}
          <Subtitle noMargin>Outstanding:</Subtitle>
          <span css={dataTextStyles}>&ge; {outstanding}%</span>
        </div>
        <div css={dataContainerStyles}>
          {neutralFaceIcon}
          <Subtitle noMargin>Adequate:</Subtitle>
          <span css={dataTextStyles}>
            {adequate}% - {needsImprovement - 1}%
          </span>
        </div>
        <div css={dataContainerStyles}>
          {sadFaceIcon}
          <Subtitle noMargin>Needs Improvement:</Subtitle>
          <span css={dataTextStyles}>&lt; {needsImprovement}%</span>
        </div>
        <div css={dataContainerStyles}>
          {informationInverseIcon}
          <Subtitle noMargin>Limited data</Subtitle>
        </div>
      </div>
      {legend && (
        <div css={captionLegendStyles}>
          <div css={iconContainerStyles}>
            {PercentageIcon({ title: 'percentage', color: lead.rgb })}
          </div>
          <Paragraph
            accent="lead"
            noMargin
            styles={css(paragraphContainerStyles)}
          >
            {legend}
          </Paragraph>
        </div>
      )}
    </CaptionCard>
  );
};

export default OpensciencePerformanceCard;
