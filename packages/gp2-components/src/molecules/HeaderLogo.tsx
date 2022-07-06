import { Anchor, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import gp2LogoFull from '../icons/gp2-logo-full';
import gp2LogoSmall from '../icons/gp2-logo-small';
import { smallDesktopQuery } from '../layout';

const { rem } = pixels;

const containerStyles = css({
  padding: `${rem(16)} 0`,
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
    display: 'flex',
  },
});

type HeaderLogoProps = {
  logoHref?: string;
};

const HeaderLogo: React.FC<HeaderLogoProps> = ({ logoHref = '/' }) => (
  <div css={containerStyles}>
    <Anchor css={[logoLinkStyles, fullLogoStyles]} href={logoHref}>
      {gp2LogoFull}
    </Anchor>
    <Anchor css={[logoLinkStyles, smallLogoStyles]} href={logoHref}>
      {gp2LogoSmall}
    </Anchor>
  </div>
);

export default HeaderLogo;
