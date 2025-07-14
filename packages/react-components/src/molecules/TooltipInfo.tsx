import { css, SerializedStyles } from '@emotion/react';

import { Info } from '..';
import { rem } from '../pixels';

const infoWrapperStyle = css({
  display: 'inline-flex',
  verticalAlign: 'bottom',
  paddingLeft: rem(6),
});

const infoStyle = css({
  display: 'grid',
  gap: rem(6),
  paddingTop: rem(6),
  paddingBottom: rem(6),
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
