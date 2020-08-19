import React, { ReactNode } from 'react';
import css from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { fern, pine, paper } from '../colors';
import { useHasRouter } from '../hooks';

const styles = css({
  outline: 'none',
  textDecoration: 'none',
  ':hover, :focus': {
    textDecoration: 'none',
  },

  color: fern.rgb,
  ':active': {
    color: pine.rgb,
  },
});

const whiteStyles = css({
  color: paper.rgb,
  ':active': {
    color: paper.rgb,
  },
});

const underlineStyles = css({
  textDecoration: 'underline',
});

interface LinkProps {
  readonly children: ReactNode;
  readonly href: string;
  readonly underline?: boolean;
  readonly white?: boolean;
}
const Link: React.FC<LinkProps> = ({
  children,
  href,
  white = false,
  underline = true,
}) => {
  if (useHasRouter()) {
    return (
      <ReactRouterLink
        css={[styles, white && whiteStyles, undeline && underlineStyles]}
        to={href}
      >
        {children}
      </ReactRouterLink>
    );
  }

  const internal =
    new URL(href, window.location.href).origin === window.location.origin;
  return (
    <a
      href={href}
      css={[styles, white && whiteStyles]}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noreferrer noopener'}
    >
      {children}
    </a>
  );
};

export default Link;
