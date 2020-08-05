import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';

const styles = css({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  padding: '0 24px',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const logoStyles = css({
  height: '72px',
});

type HeaderProps = {
  readonly light?: boolean;
  readonly children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ light = false, children }) => (
  <header css={styles}>
    <img
      alt="ASAP logo"
      src={light ? asapPaddedWhiteImage : asapPaddedImage}
      css={logoStyles}
    />
    {children && <div>{children}</div>}
  </header>
);

export default Header;
