import React from 'react';
import css from '@emotion/css';

import { fern, pine } from '../colors';
import { noop } from '../utils';
import { getButtonStyles, getButtonChildren } from '../button';

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

  backgroundColor: 'unset',
  color: fern.rgb,
  ':active': {
    color: pine.rgb,
  },
});

interface NormalButtonProps {
  readonly enabled?: boolean;
  readonly primary?: boolean;
  readonly active?: boolean;
  readonly small?: boolean;
  readonly linkStyle?: undefined;
}
interface LinkStyleButtonProps {
  readonly linkStyle: true;
  readonly enabled?: undefined;
  readonly primary?: undefined;
  readonly active?: undefined;
  readonly small?: undefined;
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
        ? linkStyles
        : getButtonStyles({ primary, small, enabled, active, children })
    }
  >
    {getButtonChildren(children)}
  </button>
);

export default Button;
