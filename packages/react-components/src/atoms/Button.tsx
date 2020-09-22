import React from 'react';
import css from '@emotion/css';

import {
  fern,
  pine,
  paper,
  OpaqueColor,
  lead,
  steel,
  tin,
  charcoal,
  silver,
} from '../colors';
import { perRem, formTargetWidth } from '../pixels';
import { noop } from '../utils';

const borderWidth = 1;
const styles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  whiteSpace: 'pre',

  maxWidth: `${formTargetWidth / perRem}em`,

  outline: 'none',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: '4px',

  cursor: 'pointer',

  fontWeight: 'bold',

  '+ button': {
    marginTop: 0,
  },

  transition: '200ms',
});

const largeStyles = css({
  height: `${(54 + 2 * borderWidth) / perRem}em`,
  '> svg': {
    height: `${24 / perRem}em`,
  },
  '> svg + span': {
    marginLeft: `${12 / perRem}em`,
  },
  '> span + svg': {
    marginLeft: `${12 / perRem}em`,
  },

  marginTop: `${(18 - 2 * borderWidth) / perRem}em`,
  marginBottom: `${(18 - 2 * borderWidth) / perRem}em`,

  paddingTop: `${15 / perRem}em`,
  paddingBottom: `${15 / perRem}em`,
  paddingLeft: `${18 / perRem}em`,
  paddingRight: `${18 / perRem}em`,
});
const smallStyles = css({
  height: `${(36 + 2 * borderWidth) / perRem}em`,
  '> svg': {
    height: `${18 / perRem}em`,
  },
  '> svg + span': {
    marginLeft: `${6 / perRem}em`,
  },
  '> span + svg': {
    marginLeft: `${6 / perRem}em`,
  },

  marginTop: `${(12 - 2 * borderWidth) / perRem}em`,
  marginBottom: `${(12 - 2 * borderWidth) / perRem}em`,

  paddingTop: `${9 / perRem}em`,
  paddingBottom: `${9 / perRem}em`,
  paddingLeft: `${12 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const largeTextOnlyStyles = css({
  paddingLeft: `${42 / perRem}em`,
  paddingRight: `${42 / perRem}em`,
});
const largeIconOnlyStyles = css({
  paddingLeft: `${15 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});
const smallIconOnlyStyles = css({
  paddingLeft: `${9 / perRem}em`,
  paddingRight: `${9 / perRem}em`,
});

const boxShadow = (color: OpaqueColor) => `0px 2px 4px -2px ${color.rgb}`;
const primaryStyles = css({
  color: paper.rgb,

  backgroundColor: fern.rgb,
  borderColor: pine.rgb,
  boxShadow: boxShadow(pine),

  ':hover, :focus': {
    backgroundColor: pine.rgb,
    borderColor: pine.rgb,
    boxShadow: boxShadow(lead),
  },

  ':active': {
    backgroundColor: pine.rgb,
    borderColor: pine.rgb,
    boxShadow: 'none',
  },
});
const secondaryStyles = css({
  backgroundColor: paper.rgb,
  borderColor: steel.rgb,
  boxShadow: boxShadow(steel),

  ':hover, :focus': {
    borderColor: charcoal.rgb,
    boxShadow: boxShadow(steel),
  },

  ':active': {
    borderColor: steel.rgb,
    boxShadow: 'none',
  },
});
const disabledStyles = css({
  color: tin.rgb,
  stroke: tin.rgb,
  backgroundColor: silver.rgb,
  borderColor: steel.rgb,
  boxShadow: 'none',
});

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
  readonly small?: boolean;
  readonly linkStyle?: undefined;
}
interface LinkStyleButtonProps {
  readonly linkStyle: true;
  readonly enabled?: undefined;
  readonly primary?: undefined;
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
        : [
            styles,
            small ? smallStyles : largeStyles,
            enabled
              ? primary
                ? primaryStyles
                : secondaryStyles
              : disabledStyles,
            (Array.isArray(children)
              ? children.some((child) => child && typeof child === 'object')
              : children && typeof children === 'object') ||
              (small ? null : largeTextOnlyStyles),
            (Array.isArray(children)
              ? children.some((child) => typeof child === 'string')
              : typeof children === 'string') ||
              (small ? smallIconOnlyStyles : largeIconOnlyStyles),
          ]
    }
  >
    {Array.isArray(children) ? (
      children.map((child) =>
        typeof child === 'string' ? <span key={child}>{child}</span> : child,
      )
    ) : typeof children === 'string' ? (
      <span>{children}</span>
    ) : (
      children
    )}
  </button>
);

export default Button;
