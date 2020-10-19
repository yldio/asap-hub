import React, { ReactNode } from 'react';
import css, { CSSObject, SerializedStyles } from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { fern, paper, pine } from '../colors';
import { useHasRouter } from '../hooks';
import { ThemeVariant, defaultThemeVariant } from '../theme';
import { getButtonStyles, getButtonChildren } from '../button';
import { isInternalLink } from '../utils';

const styles = css({
  outline: 'none',
  textDecoration: 'none',
  ':hover, :focus': {
    textDecoration: 'none',
  },
  color: 'unset',
  ':active': {
    color: 'unset',
  },
});

const themeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({ color: fern.rgb, ':active': { color: pine.rgb } }),
  grey: css({ color: fern.rgb, ':active': { color: pine.rgb } }),
  dark: css({ color: paper.rgb, ':active': { color: paper.rgb } }),
};
const underlineStyles = css({
  textDecoration: 'underline',
});

interface NormalLinkProps {
  readonly theme?: ThemeVariant | null;
  readonly display?: CSSObject['display'];

  readonly buttonStyle?: undefined;

  readonly primary?: undefined;
  readonly small?: undefined;
}
interface ButtonStyleLinkProps {
  readonly theme?: undefined;
  readonly display?: undefined;

  readonly buttonStyle: true;

  readonly primary?: boolean;
  readonly small?: boolean;
}
type LinkProps = {
  readonly children: ReactNode;
  // hrefs may conditionally be undefined, but the prop is mandatory so it cannot be forgotton
  readonly href: string | undefined;
} & (NormalLinkProps | ButtonStyleLinkProps);
const Link: React.FC<LinkProps> = ({
  children,
  href,

  theme = defaultThemeVariant,
  display,

  buttonStyle = false,
  primary = false,
  small = false,
}) => {
  const linkStyles = buttonStyle
    ? [styles, getButtonStyles({ primary, small, children })]
    : [
        styles,
        theme && themeStyles[theme],
        theme && underlineStyles,
        { display },
      ];
  const linkChildren = buttonStyle ? getButtonChildren(children) : children;
  const internal = href ? isInternalLink(href) : false;
  if (useHasRouter() && href && internal) {
    return (
      <ReactRouterLink css={linkStyles} to={href}>
        {linkChildren}
      </ReactRouterLink>
    );
  }
  return (
    <a
      href={href || undefined}
      css={linkStyles}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noreferrer noopener'}
    >
      {linkChildren}
    </a>
  );
};

export default Link;
