import {
  ceruleanFernGradientStyles,
  drawerQuery,
  steel,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';

import HeaderLogo from '../molecules/HeaderLogo';

const { rem } = pixels;

const styles = css({
  height: '100%',

  display: 'grid',
  gridTemplateRows: 'max-content auto',
  justifyItems: 'start',
});
const contentStyles = css({
  justifySelf: 'stretch',

  borderTop: `1px solid ${steel.rgb}`,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
});

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
  <article css={styles}>
    <header css={css({ width: '100%' })}>
      <HeaderLogo logoHref={logoHref} />
      <div css={[bottomBorderStyles, desktopNavigationStyles]} />
    </header>
    <main css={contentStyles}>{children}</main>
  </article>
);

export default BasicLayout;
