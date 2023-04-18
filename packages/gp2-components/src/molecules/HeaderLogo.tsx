import { Anchor, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import gp2LogoSmall from '../icons/gp2-logo-small';

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  padding: `${rem(16)} 0`,
});

type HeaderLogoProps = {
  logoHref?: string;
};

const HeaderLogo: React.FC<HeaderLogoProps> = ({ logoHref = '/' }) => (
  <div css={containerStyles}>
    <Anchor href={logoHref}>{gp2LogoSmall}</Anchor>
  </div>
);

export default HeaderLogo;
