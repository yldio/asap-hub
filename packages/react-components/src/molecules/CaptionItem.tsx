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

type CaptionItemProps = {
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
  const belowAverageCaption =
    belowAverageMax < 0 ? `- - -` : `${belowAverageMin} - ${belowAverageMax}`;

  const averageMinPositive = averageMin < 0 ? 0 : averageMin;

  return (
    <div css={containerStyles}>
      <Subtitle noMargin>{label}:</Subtitle>
      <div css={dataContainerStyles}>
        <span css={dataTextStyles}>{belowAverageCaption}</span>
        {belowAverageIcon}
      </div>
      <div css={dataContainerStyles}>
        <span
          css={dataTextStyles}
        >{`${averageMinPositive} - ${averageMax}`}</span>
        {averageIcon}
      </div>
      <div css={dataContainerStyles}>
        <span
          css={dataTextStyles}
        >{`${aboveAverageMin} - ${aboveAverageMax}`}</span>
        {aboveAverageIcon}
      </div>
    </div>
  );
};

export default CaptionItem;
