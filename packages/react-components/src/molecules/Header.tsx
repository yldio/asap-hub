import React from 'react';
import css from '@emotion/css';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';
import { paper } from '../colors';
import { Link } from '../atoms';

const height = '72px';

const containerStyles = css({
  height,
  flexGrow: 1,
  boxSizing: 'border-box',
  padding: '0 24px',

  display: 'flex',
  justifyContent: 'center',
});
const containerOpaqueStyles = css({
  backgroundColor: paper.rgb,
});

const logoStyles = css({
  height,
});

type HeaderProps = {
  readonly transparent?: boolean;
  readonly logoHref?: string;
};

const Header: React.FC<HeaderProps> = ({
  transparent = false,
  logoHref = '/',
}) => (
  <header css={[containerStyles, transparent || containerOpaqueStyles]}>
    <Link href={logoHref}>
      <img
        alt="ASAP logo"
        src={transparent ? asapPaddedWhiteImage : asapPaddedImage}
        css={logoStyles}
      />
    </Link>
  </header>
);

export default Header;
