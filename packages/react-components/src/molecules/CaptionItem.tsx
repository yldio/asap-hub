import { css } from '@emotion/react';
import { belowAverageIcon, averageIcon, aboveAverageIcon } from '../icons';
import { Subtitle } from '../atoms';
import { lead } from '../colors';
import { rem } from '../pixels';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(24),
});

const dataContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(4),
});

const dataTextStyles = css({
  fontWeight: 400,
  fontSize: rem(17),
  color: lead.rgb,
});

export type CaptionItemProps = {
  label: string;
  belowAverageMin: number;
  belowAverageMax: number;
  averageMin: number;
  averageMax: number;
  aboveAverageMin: number;
  aboveAverageMax: number;
};

const CaptionItem: React.FC<CaptionItemProps> = ({
  label,
  belowAverageMin,
  belowAverageMax,
  averageMin,
  averageMax,
  aboveAverageMin,
  aboveAverageMax,
}) => {
  // Sometimes belowAverageMax can be negative, in this case,
  // below average will not have any number
  const getCaption = (min: number, max: number) =>
    min < 0 ? `- - -` : `${min} - ${max}`;

  return (
    <div css={containerStyles}>
      <Subtitle noMargin>{label}:</Subtitle>
      <div css={dataContainerStyles}>
        <span css={dataTextStyles}>
          {getCaption(belowAverageMin, belowAverageMax)}
        </span>
        {belowAverageIcon}
      </div>
      <div css={dataContainerStyles}>
        <span css={dataTextStyles}>{getCaption(averageMin, averageMax)}</span>
        {averageIcon}
      </div>
      <div css={dataContainerStyles}>
        <span css={dataTextStyles}>
          {getCaption(aboveAverageMin, aboveAverageMax)}
        </span>
        {aboveAverageIcon}
      </div>
    </div>
  );
};

export default CaptionItem;
