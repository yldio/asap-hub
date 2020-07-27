import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage } from '../images';
import { perRem } from '../pixels';
import { steel, paper } from '../colors';
import { Link } from '../atoms';

const containerStyles = css({
  backgroundColor: paper.rgb,
  position: 'relative',
  boxSizing: 'border-box',
  width: `${256 / perRem}em`,
  flexDirection: 'column',
  borderRight: `1px solid ${steel.rgb}`,
  minHeight: '100vh',
});

const imageContainerStyles = css({
  padding: `0 ${24 / perRem}em`,
  height: `72px`,
  borderBottom: `1px solid ${steel.rgb}`,
});

const listContainerStyles = css({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: `${24 / perRem}em`,
});

const logoStyles = css({
  height: `72px`,
});

const Navigation: React.FC = () => (
  <div css={containerStyles}>
    <div css={imageContainerStyles}>
      <img alt="ASAP logo" src={asapPaddedImage} css={logoStyles} />
    </div>
    <div css={listContainerStyles}>
      <Link href="/users">Users</Link>
      <Link href="/teams">Teams</Link>
    </div>
  </div>
);

export default Navigation;
