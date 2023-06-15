import { css, CSSObject } from '@emotion/react';
import * as colors from '../colors';
import { info100, info900 } from '../colors';
import { lineHeight, perRem } from '../pixels';

export type AccentVariant = 'default' | 'green' | 'blue';

export const accents: Record<AccentVariant, CSSObject> = {
  default: {
    backgroundColor: colors.apricot.rgb,
    color: colors.clay.rgb,
  },
  green: {
    backgroundColor: colors.mint.rgb,
    color: colors.fern.rgb,
  },
  blue: {
    backgroundColor: info100.rgb,
    color: info900.rgb,
  },
};

const styles = css({
  display: 'inline-flex',
  boxSizing: 'border-box',
  padding: `${3 / perRem}em 0`,
  height: `calc(${lineHeight}px + ${6 / perRem}em)`,
  backgroundColor: colors.apricot.rgb,
  color: colors.clay.rgb,
  borderRadius: `${18 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-flex',
  alignSelf: 'center',
  marginLeft: `${9 / perRem}em`,
  marginRight: `${3 / perRem}em`,
});

const labelStyles = (withIcon: boolean) =>
  css({
    marginRight: `${15 / perRem}em`,
    marginLeft: `${(withIcon ? 0 : 15) / perRem}em`,
  });

type StateTagProps = {
  label: string;
  icon?: JSX.Element;
  accent?: AccentVariant;
};

const StateTag: React.FC<StateTagProps> = ({
  accent = 'default',
  label,
  icon,
}) => (
  <span css={[styles, accents[accent]]}>
    {icon && <span css={iconStyles}>{icon}</span>}
    <span css={labelStyles(!!icon)}>{label}</span>
  </span>
);

export default StateTag;
