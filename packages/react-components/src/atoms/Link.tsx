import React from 'react';
import css from '@emotion/css';

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
  children: TextChildren;
  href: string;
}
const Link: React.FC<LinkProps> = ({ children, href }) => (
  <a href={href} css={[styles]} target="_blank" rel="noreferrer noopener">
    {children}
  </a>
);

export default Link;
