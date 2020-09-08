import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import css from '@emotion/css';

import { steel, paper } from '../colors';
import { tabletScreen } from '../pixels';
import { MenuHeader, MainNavigation, UserNavigation } from '../organisms';
import { UserMenuButton } from '../molecules';
import { Overlay } from '../atoms';

const drawerQuery = `@media (max-width: ${tabletScreen.width - 1}px)`;
const crossQuery = `@media (min-width: ${tabletScreen.width}px)`;

const styles = css({
  position: 'relative',
  height: '100%',
  display: 'grid',
  grid: `
    "header     header"  max-content
    "main-menu  content" max-content
    "user-menu  content" max-content
    "menu-space content" 1fr         / max-content 1fr`,

  [crossQuery]: {
    grid: `
      "header     user-button" max-content
      "main-menu  content"     max-content
      "menu-space content"     1fr         / max-content 1fr`,
  },
});

const headerStyles = css({
  gridArea: 'header',

  boxSizing: 'border-box',
  borderBottom: `1px solid ${steel.rgb}`,
});
const headerMenuShownStyles = css({
  [drawerQuery]: {
    borderBottom: '1px solid transparent', // box shadow only above drawer instead
  },
});

const contentStyles = css({
  gridRow: 'header-end / -1',
  gridColumn: '1 / -1',
  [crossQuery]: {
    gridColumn: 'content',
    borderLeft: `1px solid ${steel.rgb}`,
  },
  overflowY: 'auto',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const overlayStyles = css({
  gridRow: 'main-menu / -1',
  gridColumn: '1 / -1',
  [crossQuery]: {
    display: 'none',
  },
});

const userButtonStyles = css({
  [drawerQuery]: {
    display: 'none',
  },

  borderBottom: `1px solid ${steel.rgb}`,
  borderLeft: `1px solid ${steel.rgb}`,

  display: 'flex',
  justifyContent: 'flex-end',
  alignContent: 'center',
});

const menuStyles = css({
  backgroundColor: paper.rgb,

  [drawerQuery]: {
    visibility: 'hidden',
    transform: 'translateX(-100%)',
    transition: `transform 250ms ease, visibility 0s 250ms`,
  },
});
const menuMenuShownStyles = css({
  [drawerQuery]: {
    visibility: 'visible',
    transform: 'translateX(0)',
    transition: `transform 250ms ease`,
  },
});

const mainMenuStyles = css({
  gridArea: 'main-menu',

  [drawerQuery]: {
    boxShadow: `0 -1px 0 ${steel.rgb}`, // instead of header border bottom
  },
});
const userMenuStyles = css({
  gridArea: 'user-menu',

  [crossQuery]: {
    gridArea: 'content',

    position: 'absolute',
    top: '6px',
    right: '24px',

    display: 'none',
  },
});
const userMenuShownStyles = css({
  [crossQuery]: {
    display: 'unset',
  },
});
const menuSpaceStyles = css({
  gridArea: 'menu-space',
});

interface LayoutProps {
  readonly children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [menuShown, setMenuShown] = useState(false);

  let location: Location | undefined;
  // This hook *is* called unconditionally despite what rules-of-hooks says
  /* eslint-disable react-hooks/rules-of-hooks */
  try {
    location = useLocation();
  } catch {
    // If there is no router, fine, never auto-close the menu
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  useEffect(() => {
    setMenuShown(false);
  }, [location]);

  return (
    <article css={[styles]}>
      {/* order relevant for overlap */}
      <div css={[headerStyles, menuShown && headerMenuShownStyles]}>
        <MenuHeader onToggleMenu={() => setMenuShown(!menuShown)} />
      </div>
      <div css={userButtonStyles}>
        <UserMenuButton onClick={() => setMenuShown(!menuShown)} />
      </div>
      <main css={contentStyles}>{children}</main>
      <div css={[overlayStyles]}>
        <Overlay shown={menuShown} onClick={() => setMenuShown(false)} />
      </div>
      <div css={[menuStyles, menuShown && menuMenuShownStyles, mainMenuStyles]}>
        <MainNavigation />
      </div>
      <div
        css={[
          menuStyles,
          menuShown && menuMenuShownStyles,
          userMenuStyles,
          menuShown && userMenuShownStyles,
        ]}
      >
        <UserNavigation />
      </div>
      <div
        role="presentation"
        css={[menuStyles, menuShown && menuMenuShownStyles, menuSpaceStyles]}
      />
    </article>
  );
};

export default Layout;
