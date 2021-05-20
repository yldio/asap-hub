import { css } from '@emotion/react';

import { noop } from '../utils';
import { getButtonStyles, getButtonChildren } from '../button';
import { themeStyles } from './Link';
import { defaultThemeVariant, ThemeVariant } from '../theme';

const linkStyles = css({
  display: 'inline',
  '> svg': {
    minHeight: '1em',
    height: '100%',
  },

  padding: 0,
  border: 'none',
  outline: 'none',

  cursor: 'pointer',

  textDecoration: 'underline',
  ':hover, :focus': {
    textDecoration: 'none',
  },
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
}
interface LinkStyleButtonProps {
  readonly linkStyle: true;
  readonly enabled?: undefined;
  readonly primary?: undefined;
  readonly active?: undefined;
  readonly small?: undefined;
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
        ? [linkStyles, theme && themeStyles[theme]]
        : getButtonStyles({ primary, small, enabled, active, children })
    }
  >
    {getButtonChildren(children)}
  </button>
);

export default Button;
