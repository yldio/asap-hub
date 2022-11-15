import { css } from '@emotion/react';

import { asapPaddedImage, asapPaddedWhiteImage } from '../images';
import { paper } from '../colors';
import { Link } from '../atoms';

const height = '72px';

const containerStyles = (enabled: boolean) =>
  css({
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
  <header
    css={[containerStyles(enabled), transparent || containerOpaqueStyles]}
  >
    <Link href={enabled ? logoHref : undefined}>
      <span css={logoStyles}>
        {transparent ? asapPaddedWhiteImage : asapPaddedImage}
      </span>
    </Link>
  </header>
);

export default Header;
