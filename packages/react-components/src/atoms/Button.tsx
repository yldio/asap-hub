import { css } from '@emotion/react';

import { getButtonChildren, getButtonStyles } from '../button';
import { defaultThemeVariant, ThemeVariant } from '../theme';
import { noop } from '../utils';
import { styles as linkStyles, themeStyles } from './Link';

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
  readonly stretch?: boolean;
}
interface LinkStyleButtonProps {
  readonly linkStyle: true;
  readonly enabled?: undefined;
  readonly primary?: undefined;
  readonly active?: undefined;
  readonly small?: undefined;
  readonly stretch?: undefined;
  readonly theme?: ThemeVariant | null;
}
type ButtonProps = (NormalButtonProps | LinkStyleButtonProps) & {
  readonly submit?: boolean;

  readonly children?: React.ReactNode;

  readonly onClick?: () => void;
};
const Button: React.FC<ButtonProps> = ({
  enabled = true,
  primary = false,
  small = false,
  linkStyle = false,
  active = false,
  theme = defaultThemeVariant,
  submit = primary,
  children,
  stretch = true,
  onClick = noop,
}) => (
  <button
    type={submit ? 'submit' : 'button'}
    disabled={!enabled}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
    css={
      linkStyle
        ? [linkStyles, buttonAsLinkStyles, theme && themeStyles[theme]]
        : getButtonStyles({
            primary,
            small,
            enabled,
            active,
            children,
            stretch,
          })
    }
  >
    {getButtonChildren(children)}
  </button>
);

export default Button;
