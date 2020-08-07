import React from 'react';
import css from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { TextChildren } from '../text';
import { fern, pine } from '../colors';
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

interface LinkProps {
  readonly children: TextChildren;
  readonly href: string;
}
const Link: React.FC<LinkProps> = ({ children, href }) => {
  if (useHasRouter()) {
    return (
      <ReactRouterLink css={[styles]} to={href}>
        {children}
      </ReactRouterLink>
    );
  }

  const internal =
    new URL(href, window.location.href).origin === window.location.origin;
  return (
    <a
      href={href}
      css={[styles]}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noreferrer noopener'}
    >
      {children}
    </a>
  );
};

export default Link;
