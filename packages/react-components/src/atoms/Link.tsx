import React, { ReactNode } from 'react';
import css from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { fern, pine, paper } from '../colors';
import { useHasRouter } from '../hooks';

const styles = css({
  outline: 'none',
  textDecoration: 'underline',
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

interface LinkProps {
  readonly children: ReactNode;
  readonly href: string;

  readonly white?: boolean;
}
const Link: React.FC<LinkProps> = ({ children, href, white = false }) => {
  if (useHasRouter()) {
    return (
      <ReactRouterLink css={[styles, white && whiteStyles]} to={href}>
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
