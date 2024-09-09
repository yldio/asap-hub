import { css, SerializedStyles } from '@emotion/react';

import { Info } from '..';
import { perRem } from '../pixels';

const infoWrapperStyle = css({
  display: 'inline-flex',
  verticalAlign: 'bottom',
  paddingLeft: `${6 / perRem}em`,
});

const infoStyle = css({
  display: 'grid',
  gap: `${6 / perRem}em`,
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,
});

type TooltipInfoProps = {
  overrideWrapperStyles?: SerializedStyles;
  overrideTooltipStyles?: SerializedStyles;
  children: React.ReactNode;
};

const TooltipInfo: React.FC<TooltipInfoProps> = ({
  overrideWrapperStyles,
  overrideTooltipStyles,
  children,
}) => (
  <span
    css={[infoWrapperStyle, overrideWrapperStyles]}
    onClick={(e) => e.preventDefault()}
  >
    <Info>
      <span css={[infoStyle, overrideTooltipStyles]}>{children}</span>
    </Info>
  </span>
);

export default TooltipInfo;
