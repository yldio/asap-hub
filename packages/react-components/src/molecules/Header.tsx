import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';
import { steel, paper } from '../colors';

const height = '72px';

const styles = css({
  boxSizing: 'border-box',
  flexBasis: '100%',
  flexShrink: 1,
  height,
  padding: '0 24px',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const containerStyles = css({
  height,
});
const logoStyles = css({
  height,
});

const containerOpaqueStyles = css({
  backgroundColor: paper.rgb,
  borderBottom: `1px solid ${steel.rgb}`,
});
const opaqueStyles = css({
  // if transparent, fixed does not make sense because things could scroll visually through the header
  position: 'fixed',
});

type HeaderProps = {
  readonly transparent?: boolean;
};

const Header: React.FC<HeaderProps> = ({ transparent = false }) => (
  <div css={[containerStyles, transparent || containerOpaqueStyles]}>
    <header css={[styles, transparent || opaqueStyles]}>
      <img
        alt="ASAP logo"
        src={transparent ? asapPaddedWhiteImage : asapPaddedImage}
        css={logoStyles}
      />
    </header>
  </div>
);

export default Header;
