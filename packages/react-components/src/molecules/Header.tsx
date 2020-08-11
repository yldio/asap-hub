import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';
import { steel, paper } from '../colors';

const height = '72px';

const styles = css({
  position: 'fixed',

  boxSizing: 'border-box',
  width: '100%',
  height,
  padding: '0 24px',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const opaqueStyles = css({
  backgroundColor: paper.rgb,
  borderBottom: `1px solid ${steel.rgb}`,
});

const containerStyles = css({
  height,
});
const logoStyles = css({
  height,
});

type HeaderProps = {
  readonly transparent?: boolean;
  readonly children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ transparent = false, children }) => (
  <div css={containerStyles}>
    <header css={[styles, transparent || opaqueStyles]}>
      <img
        alt="ASAP logo"
        src={transparent ? asapPaddedWhiteImage : asapPaddedImage}
        css={logoStyles}
      />
      {children && <div>{children}</div>}
    </header>
  </div>
);

export default Header;
