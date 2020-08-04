import React from 'react';
import css from '@emotion/css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { TextChildren } from '../text';
import { fern, pine } from '../colors';

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
  const internal = /^\/(?!\/)/.test(href);
  if (internal) {
    return (
      <ReactRouterLink css={[styles]} to={href}>
        {children}
      </ReactRouterLink>
    );
  }
  return (
    <a href={href} css={[styles]} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
};

export default Link;
