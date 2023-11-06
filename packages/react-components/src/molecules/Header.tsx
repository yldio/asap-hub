import { css } from '@emotion/react';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';
import { asapLogoMobile } from '../icons';
import { paper } from '../colors';
import { Link } from '../atoms';
import { mobileScreen } from '../pixels';

const height = '72px';

const containerStyles = css({
  height,
  flexGrow: 1,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
});
const containerOpaqueStyles = css({
  backgroundColor: paper.rgb,
});

const logoStyles = css({
  height,
  display: 'flex',
  alignItems: 'center',
  svg: {
    height: '32px',
  },
});

const logoMobileStyles = css({
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});
const logoDesktopStyles = css({
  display: 'none',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'inherit',
  },
});

type HeaderProps = {
  readonly enabled?: boolean;
  readonly transparent?: boolean;
  readonly logoHref?: string;
};

const Header: React.FC<HeaderProps> = ({
  enabled = true,
  transparent = false,
  logoHref = '/',
}) => (
  <header css={[containerStyles, transparent || containerOpaqueStyles]}>
    <Link href={enabled ? logoHref : undefined}>
      <div css={logoDesktopStyles}>
        <span css={logoStyles}>
          {transparent ? asapPaddedWhiteImage : asapPaddedImage}
        </span>
      </div>
      <div css={logoMobileStyles}>
        <span css={logoStyles}>{asapLogoMobile}</span>
      </div>
    </Link>
  </header>
);

export default Header;
