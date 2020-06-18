import React from 'react';
import css from '@emotion/css';

import { asapImage } from '../images';
import { steel } from '../colors';

const styles = css({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  padding: '18px 24px',

  borderBottom: `2px solid ${steel.rgb}`,
});

const logoStyles = css({
  // TODO logo not aligned
  height: '36px',
});

const Header: React.FC<{}> = () => (
  <header css={styles}>
    <img alt="ASAP logo" src={asapImage} css={logoStyles} />
  </header>
);

export default Header;
