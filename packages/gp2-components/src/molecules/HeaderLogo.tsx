import { css } from '@emotion/react';
import gp2LogoFull from '../icons/gp2-logo-full';
import gp2LogoSmall from '../icons/gp2-logo-small';
import { smallDesktopQuery } from '../layout';

const containerStyles = css({
  padding: '16px 0',
});
const logoLinkStyles = css({
  display: 'flex',
});
const fullLogoStyles = css({
  [smallDesktopQuery]: {
    display: 'none',
  },
});
const smallLogoStyles = css({
  display: 'none',
  [smallDesktopQuery]: {
    display: 'unset',
  },
});

const HeaderLogo: React.FC = () => (
  <div css={containerStyles}>
    <a css={[logoLinkStyles, fullLogoStyles]} href="/">
      {gp2LogoFull}
    </a>
    <a css={[logoLinkStyles, smallLogoStyles]} href="/">
      {gp2LogoSmall}
    </a>
  </div>
);

export default HeaderLogo;
