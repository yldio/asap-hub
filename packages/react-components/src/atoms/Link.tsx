import React, { ReactNode } from 'react';
import css, { CSSObject, SerializedStyles } from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { fern, paper, pine } from '../colors';
import { useHasRouter } from '../hooks';
import { ThemeVariant, defaultThemeVariant } from '../theme';

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

interface LinkProps {
  readonly children: ReactNode;
  readonly href: string;
  readonly theme?: ThemeVariant | null;
  readonly display?: CSSObject['display'];
}
const Link: React.FC<LinkProps> = ({
  children,
  href,
  theme = defaultThemeVariant,
  display,
}) => {
  const linkStyles = [
    styles,
    theme && themeStyles[theme],
    theme && underlineStyles,
    { display },
  ];
  if (useHasRouter()) {
    return (
      <ReactRouterLink css={linkStyles} to={href}>
        {children}
      </ReactRouterLink>
    );
  }

  const internal =
    new URL(href, window.location.href).origin === window.location.origin;
  return (
    <a
      href={href}
      css={linkStyles}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noreferrer noopener'}
    >
      {children}
    </a>
  );
};

export default Link;
