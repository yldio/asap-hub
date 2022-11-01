import { css } from '@emotion/react';
import * as colors from '../colors';
import { lineHeight, perRem } from '../pixels';
import { AccentColorName } from '../text';

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
  textColor?: AccentColorName;
  backgroundColor?: AccentColorName;
};

const StateTag: React.FC<StateTagProps> = ({
  label,
  icon,
  textColor,
  backgroundColor,
}) => (
  <span
    css={[
      styles,
      textColor ? { color: colors[textColor].rgb } : null,
      backgroundColor ? { backgroundColor: colors[backgroundColor].rgb } : null,
    ]}
  >
    {icon && <span css={iconStyles}>{icon}</span>}
    <span css={labelStyles(!!icon)}>{label}</span>
  </span>
);

export default StateTag;
