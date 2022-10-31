import {
  ceruleanFernGradientStyles,
  drawerQuery,
  steel,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';

import HeaderLogo from '../molecules/HeaderLogo';
import Theme from './Theme';

const { rem, vminLinearCalcClamped, mobileScreen, tabletScreen } = pixels;

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  width: '748px',
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    33,
    tabletScreen,
    48,
    'px',
  )} 0`,
  margin: `0 auto`,
  [drawerQuery]: {
    maxWidth: '748px',
    width: 'auto',
    margin: `0 ${vminLinearCalcClamped(
      mobileScreen,
      24,
      tabletScreen,
      72,
      'px',
    )}`,
  },
});

const logoStyles = css({ padding: `0 ${rem(24)}` });
const desktopNavigationStyles = css({
  [drawerQuery]: {
    display: 'none',
  },
});

const bottomBorderStyles = css({
  height: rem(4),
  width: '100%',
  ...ceruleanFernGradientStyles,
});

type BasicLayoutProps = {
  children: React.ReactNode;
  logoHref?: string;
};
const BasicLayout: React.FC<BasicLayoutProps> = ({ children, logoHref }) => (
  <Theme>
    <article>
      <header css={css({ width: '100%' })}>
        <div css={logoStyles}>
          <HeaderLogo logoHref={logoHref} />
        </div>
        <div css={[bottomBorderStyles, desktopNavigationStyles]} />
      </header>
      <main css={contentStyles}>{children}</main>
    </article>
  </Theme>
);

export default BasicLayout;
