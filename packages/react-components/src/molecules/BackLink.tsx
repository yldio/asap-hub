import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { chevronCircleLeftIcon, Link } from '..';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const containerStyles = css({
  alignSelf: 'flex-start',
  padding: `${30 / perRem}em 0 `,
});

interface BackLinkProps {
  readonly href: string;
}
const BackLink: React.FC<BackLinkProps> = ({ href }) => (
  <div css={containerStyles}>
    <Link href={href}>
      <span css={iconStyles}>{chevronCircleLeftIcon}</span>Back
    </Link>
  </div>
);

export default BackLink;
