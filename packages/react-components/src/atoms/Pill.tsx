import { css, CSSObject, SerializedStyles } from '@emotion/react';
import { Ellipsis } from '.';
import * as colors from '../colors';
import { lineHeight, perRem } from '../pixels';

const borderWidth = 1;
const styles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  height: lineHeight,
  margin: `${12 / perRem}em 0`,
  padding: `0 ${8 / perRem}em`,
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: `${6 / perRem}em`,
});

export type AccentVariant =
  | 'default'
  | 'green'
  | 'warning'
  | 'info'
  | 'neutral';

export const accents: Record<AccentVariant, CSSObject> = {
  default: {
    borderColor: colors.steel.rgb,
    backgroundColor: colors.paper.rgb,
    color: colors.lead.rgb,
  },
  green: {
    backgroundColor: colors.mint.rgb,
    color: colors.pine.rgb,
    borderColor: colors.pine.rgb,
  },
  warning: {
    backgroundColor: colors.warning100.rgb,
    color: colors.warning500.rgb,
    borderColor: colors.warning500.rgb,
  },
  info: {
    backgroundColor: colors.informationInfo100.rgb,
    color: colors.informationInfo500.rgb,
    borderColor: colors.informationInfo500.rgb,
  },
  neutral: {
    backgroundColor: colors.neutral300.rgb,
    color: colors.neutral800.rgb,
    borderColor: colors.neutral800.rgb,
  },
};

type PillProps = {
  readonly children?: React.ReactNode;
  readonly overrideStyles?: SerializedStyles;
  readonly small?: boolean;
  readonly accent?: AccentVariant;
};

const Pill: React.FC<PillProps> = ({
  children,
  overrideStyles,
  small = true,
  accent = 'default',
}) => (
  <span css={[styles, accents[accent], overrideStyles]}>
    <Ellipsis>{small ? <small>{children}</small> : children}</Ellipsis>
  </span>
);

export default Pill;
