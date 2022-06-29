import { useState, FC, ReactNode } from 'react';
import { css } from '@emotion/react';

import {
  ToastStack,
  drawerQuery,
  pixels,
  crossQuery,
  Overlay,
  paper,
  navigationGrey,
} from '@asap-hub/react-components';

import NavigationHeader from '../organism/NavigationHeader';
import UserMenu from '../molecules/UserMenu';
import MainNavigation from '../organism/MainNavigation';

const { mobileScreen, tabletScreen, vminLinearCalcClamped } = pixels;

const styles = css({
  height: '100%',
  position: 'relative',
  display: 'grid',
  grid: `
    "header     header"  max-content
    "main-menu  content" max-content
    "user-menu  content" 1fr / max-content 1fr
`,
  [crossQuery]: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

const headerStyles = css({
  gridArea: 'header',
});

const overlayStyles = css({
  gridRow: 'main-menu / -1',
  gridColumn: '1 / -1',

  visibility: 'hidden',
  [crossQuery]: {
    display: 'none',
  },
});
const overlayMenuShownStyles = css({
  visibility: 'visible',
});

const contentStyles = css({
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

const menuStyles = css({
  backgroundColor: paper.rgb,
  gridColumnStart: '1',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gridRow: `main-menu/-1`,
  visibility: 'hidden',
  transform: 'translateX(-100%)',
  transition: `transform 250ms ease, visibility 0s 250ms`,
});
const menuMenuShownStyles = css({
  visibility: 'visible',
  transform: 'translateX(0)',
  transition: `transform 250ms ease`,
});

const mainMenuStyles = css({
  gridArea: 'main-menu',
});
const userMenuStyles = css({
  backgroundColor: navigationGrey.rgb,
  gridArea: 'user-menu',
  flexGrow: 1,
});

type LayoutProps = {
  readonly children: ReactNode;
};
const Layout: FC<LayoutProps> = ({ children }) => {
  const [menuShown, setMenuShown] = useState(false);

  return (
    <ToastStack>
      <article css={styles}>
        <div css={headerStyles}>
          <NavigationHeader
            menuOpen={menuShown}
            onToggleMenu={() => {
              setMenuShown(!menuShown);
            }}
          />
        </div>

        <div
          css={css({
            gridRow: 'header-end / -1',
            gridColumn: '1 / -1',
            overflowY: 'auto',
          })}
        >
          <main css={contentStyles}>{children}</main>
        </div>
        <div css={[overlayStyles, menuShown && overlayMenuShownStyles]}>
          <Overlay shown={menuShown} onClick={() => setMenuShown(false)} />
        </div>
        <div css={[menuStyles, menuShown && menuMenuShownStyles]}>
          <div css={[mainMenuStyles]}>
            <MainNavigation />
          </div>
          <div css={[userMenuStyles]}>
            <UserMenu />
          </div>
        </div>
      </article>
    </ToastStack>
  );
};

export default Layout;
