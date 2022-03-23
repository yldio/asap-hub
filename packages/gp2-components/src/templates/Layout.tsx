import React, {
  Suspense,
  useState,
  useEffect,
  ComponentProps,
  createRef,
  FC,
  ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { css } from '@emotion/react';

import {
  steel,
  paper,
  tin,
  colorWithTransparency,
  pearl,
  MenuHeader,
  OnboardingFooter,
  ToastStack,
  Overlay,
  navigationGrey,
  crossQuery,
  drawerQuery,
  Loading,
  usePrevious,
  UserMenuButton,
  MainNavigation,
} from '@asap-hub/react-components';
import UserNavigation from '../organism/UserNavigation';

const styles = css({
  position: 'relative',
  height: '100%',
  display: 'grid',
  grid: `
    "header     header"  max-content
    "main-menu  content" max-content
    "user-menu  content" 1fr
    "footer     footer"  auto   / max-content 1fr`,

  [crossQuery]: {
    grid: `
      "header     user-button" max-content
      "main-menu  content"     1fr
      "footer     footer" auto / max-content 1fr`,
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
  gridRow: 'header-end / -2',
  gridColumn: '1 / -1',
  [crossQuery]: {
    gridColumn: 'content',
    borderLeft: `1px solid ${steel.rgb}`,
  },
  overflowY: 'auto',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',

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
  gridRow: `main-menu`,
  gridColumnStart: '1',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  [drawerQuery]: {
    gridRow: `main-menu/-1`,
    visibility: 'hidden',
    transform: 'translateX(-100%)',
    transition: `transform 250ms ease, visibility 0s 250ms`,
    boxShadow: `0 -1px 0 ${steel.rgb}`, // instead of header border bottom
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
  backgroundColor: paper.rgb,
  gridArea: 'user-menu',
  flexGrow: 1,
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
  readonly children: ReactNode;
} & Partial<ComponentProps<typeof OnboardingFooter>> &
  ComponentProps<typeof MainNavigation> &
  ComponentProps<typeof UserNavigation>;
const Layout: FC<LayoutProps> = ({
  children,
  onboardable,
  onboardModalHref,
  ...userNavProps
}) => {
  const [menuShown, setMenuShown] = useState(false);

  let location: Location | undefined;
  let prevLocation: Location | undefined;
  const mainRef = createRef<HTMLDivElement>();
  // This hook *is* called unconditionally despite what rules-of-hooks says
  /* eslint-disable react-hooks/rules-of-hooks */
  try {
    location = useLocation();
    prevLocation = usePrevious(location);
  } catch {
    // If there is no router, fine, never auto-close the menu
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  useEffect(() => {
    setMenuShown(false);
  }, [location]);
  useEffect(() => {
    if (location?.pathname !== prevLocation?.pathname && mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location, prevLocation, mainRef]);

  return (
    <ToastStack>
      <article css={[styles, menuShown || { overflow: 'hidden' }]}>
        {/* order relevant for overlap */}
        <div css={[headerStyles, menuShown && headerMenuShownStyles]}>
          <MenuHeader
            enabled={userNavProps.userOnboarded}
            menuOpen={menuShown}
            onToggleMenu={() => setMenuShown(!menuShown)}
          />
        </div>
        <div css={userButtonStyles}>
          <Suspense fallback={<Loading />}>
            <UserMenuButton
              onClick={() => setMenuShown(!menuShown)}
              open={menuShown}
            />
          </Suspense>
        </div>
        <main ref={mainRef} css={contentStyles}>
          {children}
        </main>
        <div css={[overlayStyles, menuShown && overlayMenuShownStyles]}>
          <Overlay shown={menuShown} onClick={() => setMenuShown(false)} />
        </div>
        <div css={[menuStyles, menuShown && menuMenuShownStyles]}>
          <div css={[mainMenuStyles]}>
            {/* <Suspense fallback={<Loading />}>
              <MainNavigation userOnboarded={userNavProps.userOnboarded} />
            </Suspense> */}
          </div>
          <div css={[userMenuStyles, menuShown && userMenuShownStyles]}>
            <Suspense fallback={<Loading />}>
              <UserNavigation {...userNavProps} />
            </Suspense>
          </div>
        </div>
        {onboardable && (
          <div css={{ gridArea: 'footer' }}>
            <OnboardingFooter
              onboardModalHref={onboardModalHref}
              onboardable={onboardable}
            />
          </div>
        )}
      </article>
    </ToastStack>
  );
};

export default Layout;
