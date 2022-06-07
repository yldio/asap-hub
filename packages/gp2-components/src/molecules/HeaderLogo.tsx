import { Anchor } from '@asap-hub/react-components';
import { rem } from '@asap-hub/react-components/src/pixels';
import { css } from '@emotion/react';
import gp2LogoFull from '../icons/gp2-logo-full';
import gp2LogoSmall from '../icons/gp2-logo-small';
import { smallDesktopQuery } from '../layout';

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

const HeaderLogo: React.FC = () => (
  <div css={containerStyles}>
    <Anchor css={[logoLinkStyles, fullLogoStyles]} href="/">
      {gp2LogoFull}
    </Anchor>
    <Anchor css={[logoLinkStyles, smallLogoStyles]} href="/">
      {gp2LogoSmall}
    </Anchor>
  </div>
);

export default HeaderLogo;
