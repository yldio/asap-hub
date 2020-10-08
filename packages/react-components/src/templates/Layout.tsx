import React, { useState, useEffect, ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import css from '@emotion/css';

import { steel, paper, tin, colorWithTransparency, pearl } from '../colors';
import { MenuHeader, MainNavigation, UserNavigation } from '../organisms';
import { UserMenuButton } from '../molecules';
import { Overlay } from '../atoms';
import { navigationGrey, crossQuery, drawerQuery } from '../layout';

const styles = css({
  position: 'relative',
  height: '100%',
  display: 'grid',
  grid: `
    "header     header"  max-content
    "main-menu  content" max-content
    "user-menu  content" 1fr         / max-content 1fr`,

  [crossQuery]: {
    grid: `
      "header     user-button" max-content
      "main-menu  content"     1fr         / max-content 1fr`,
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

  backgroundColor: pearl.rgb,
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

    display: 'none',

    position: 'absolute',
    top: '6px',
    right: '24px',

    border: `1px solid ${steel.rgb}`,
    boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,
  },
});
const userMenuShownStyles = css({
  [drawerQuery]: {
    backgroundColor: navigationGrey.rgb,
  },
  [crossQuery]: {
    display: 'unset',
  },
});

type LayoutProps = {
  readonly children: React.ReactNode;
} & ComponentProps<typeof MainNavigation> &
  ComponentProps<typeof UserNavigation>;
const Layout: React.FC<LayoutProps> = ({
  children,
  libraryHref,
  networkHref,
  newsAndEventsHref,
  ...userNavProps
}) => {
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
        <MenuHeader
          menuOpen={menuShown}
          onToggleMenu={() => setMenuShown(!menuShown)}
        />
      </div>
      <div css={userButtonStyles}>
        <UserMenuButton
          onClick={() => setMenuShown(!menuShown)}
          open={menuShown}
        />
      </div>
      <main css={contentStyles}>{children}</main>
      <div css={[overlayStyles, menuShown && overlayMenuShownStyles]}>
        <Overlay shown={menuShown} onClick={() => setMenuShown(false)} />
      </div>
      <div css={[menuStyles, menuShown && menuMenuShownStyles, mainMenuStyles]}>
        <MainNavigation
          libraryHref={libraryHref}
          networkHref={networkHref}
          newsAndEventsHref={newsAndEventsHref}
        />
      </div>
      <div
        css={[
          menuStyles,
          menuShown && menuMenuShownStyles,
          userMenuStyles,
          menuShown && userMenuShownStyles,
        ]}
      >
        <UserNavigation {...userNavProps} />
      </div>
    </article>
  );
};

export default Layout;
