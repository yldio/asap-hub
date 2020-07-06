import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage } from '../images';
import { steel } from '../colors';

const styles = css({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  padding: '0 24px',

  borderBottom: `1px solid ${steel.rgb}`,
});

const logoStyles = css({
  height: '72px',
});

const Header: React.FC<{}> = () => (
  <header css={styles}>
    <img alt="ASAP logo" src={asapPaddedImage} css={logoStyles} />
  </header>
);

export default Header;
