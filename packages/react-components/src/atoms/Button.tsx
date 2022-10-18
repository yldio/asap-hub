import { css, SerializedStyles } from '@emotion/react';

import { getButtonChildren, getButtonStyles } from '../button';
import { defaultThemeVariant, ThemeVariant } from '../theme';
import { noop } from '../utils';
import { getLinkColors, styles as linkStyles } from './Link';

const buttonAsLinkStyles = css({
  display: 'inline',
  '> svg': {
    minHeight: '1em',
    height: '100%',
  },

  padding: 0,
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: 'unset',
  backgroundColor: 'unset',
});

interface NormalButtonProps {
  readonly enabled?: boolean;
  readonly primary?: boolean;
  readonly active?: boolean;
  readonly small?: boolean;
  readonly linkStyle?: undefined;
  readonly theme?: undefined;
  readonly noMargin?: boolean;
}
interface LinkStyleButtonProps {
  readonly linkStyle: true;
  readonly enabled?: undefined;
  readonly primary?: undefined;
  readonly active?: undefined;
  readonly small?: undefined;
  readonly theme?: ThemeVariant;
  readonly noMargin?: undefined;
}
type ButtonProps = (NormalButtonProps | LinkStyleButtonProps) & {
  readonly submit?: boolean;
  readonly children?: React.ReactNode;
  readonly overrideStyles?: SerializedStyles;
  readonly onClick?: () => void;
};
const Button: React.FC<ButtonProps> = ({
  enabled = true,
  primary = false,
  small = false,
  linkStyle = false,
  active = false,
  noMargin,
  theme = defaultThemeVariant,
  submit = primary,
  children,
  onClick = noop,
  overrideStyles,
}) => (
  <button
    type={submit ? 'submit' : 'button'}
    disabled={!enabled}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
    css={({ colors }) => [
      linkStyle
        ? [linkStyles, buttonAsLinkStyles, getLinkColors(colors, theme)]
        : getButtonStyles({
            primary,
            small,
            enabled,
            active,
            children,
            noMargin,
            colors,
          }),
      overrideStyles,
    ]}
  >
    {getButtonChildren(children)}
  </button>
);

export default Button;
