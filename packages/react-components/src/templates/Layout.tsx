import {
  Suspense,
  useState,
  useEffect,
  useCallback,
  ComponentProps,
  FC,
  lazy,
  ReactNode,
  useRef,
} from 'react';
import { useLocation } from 'react-router';
import { css } from '@emotion/react';
import { tags } from '@asap-hub/routing';
import { ScrollContext } from '@asap-hub/react-context';

import {
  steel,
  paper,
  tin,
  colorWithTransparency,
  pearl,
  charcoal,
  success900,
} from '../colors';
import { MenuHeader, OnboardingFooter, ToastStack } from '../organisms';
import { Overlay } from '../atoms';
import {
  navigationGrey,
  crossQuery,
  drawerQuery,
  networkContentTopPadding,
  menuTransitionMs,
  shortViewportQuery,
} from '../layout';
import { Loading } from '../molecules';
import { usePrevious, useDismiss } from '../hooks';
import { tagSearchIcon } from '../icons';
import { rem } from '../pixels';
import { Navigation } from '../atoms/NavigationLink';
import { LoadingUserButton, LoadingMenu } from './LoadingLayout';
import { useScrollToHash } from '../routing';

const UserMenuButton = lazy(
  () =>
    import(
      /* webpackChunkName: "user-menu-button" */ '../molecules/UserMenuButton'
    ),
);
const MainNavigation = lazy(
  () =>
    import(
      /* webpackChunkName: "main-navigation" */ '../organisms/MainNavigation'
    ),
);
const UserNavigation = lazy(
  () =>
    import(
      /* webpackChunkName: "user-navigation" */ '../organisms/UserNavigation'
    ),
);

// Fires its callback once mounted. Placed inside a Suspense boundary, its
// effect runs only after the boundary's lazy children have resolved.
const OnMount: FC<{ onMount: () => void }> = ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
};

const menuCollapsedStorageKey = 'asap-crn-menu-collapsed';

// Fixed rail width when the desktop menu is collapsed (icon-only).
const collapsedMenuWidth = 72;
// Fixed width of the expanded desktop menu. A length (rather than
// `max-content`) so the grid column can animate between the two states.
const expandedMenuWidth = 268;

export const styles = css({
  position: 'relative',
  minHeight: '100vh',
  maxHeight: '100vh',
  display: 'grid',
  grid: `
    "header     header  search-button"  max-content
    "main-menu  content content"        max-content
    "user-menu  content content"        1fr
    "footer     footer  footer"         auto   / max-content 1fr 72px`,

  [crossQuery]: {
    // Full-width top bar spanning all columns, above a sidebar/content row.
    // The logo therefore never shifts or clips as the sidebar collapses.
    grid: `
      "header     header   header"  max-content
      "main-menu  content  content" 1fr
      "footer     footer   footer"  auto / ${rem(expandedMenuWidth)} 1fr 72px`,
    transition: `grid-template-columns ${menuTransitionMs}ms ease`,
  },
});
// Only affects the desktop layout; the mobile drawer overlays and is unaffected
// by the first grid column's width.
const collapsedStyles = css({
  [crossQuery]: {
    gridTemplateColumns: `${rem(collapsedMenuWidth)} 1fr 72px`,
  },
});

export const headerStyles = css({
  gridArea: 'header',

  boxSizing: 'border-box',
  borderBottom: `1px solid ${steel.rgb}`,
  // On desktop the top bar owns the full width; lay the logo out on the left
  // with the search/profile controls pushed to the right.
  [crossQuery]: {
    display: 'flex',
    alignItems: 'stretch',
  },
});
const headerMenuShownStyles = css({
  [drawerQuery]: {
    borderBottom: '1px solid transparent', // box shadow only above drawer instead
  },
});

export const contentStyles = css({
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

export const userButtonStyles = css({
  [drawerQuery]: {
    display: 'none',
  },

  borderBottom: `1px solid ${steel.rgb}`,
  borderLeft: `1px solid ${steel.rgb}`,

  display: 'flex',
  justifyContent: 'flex-end',
  alignContent: 'center',

  // On desktop the top bar is a single full-width row: sit the profile control
  // at the right of the header row with no dividing borders inside the bar.
  [crossQuery]: {
    gridColumn: '2 / 3',
    gridRow: '1 / 2',
    justifySelf: 'end',
    border: 'none',
    zIndex: 1,
  },
});

export const menuStyles = css({
  backgroundColor: paper.rgb,
  gridRow: `main-menu`,
  gridColumnStart: '1',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100vw',
  // Must not clip, so the absolutely-positioned collapsed tooltips can escape
  // the narrow column (a scroll container would clip both axes).
  [crossQuery]: {
    overflow: 'visible',
  },
  // Too short to fit the nav: reaching every item beats the tooltip escaping.
  [shortViewportQuery]: {
    overflowY: 'auto',
  },
  [drawerQuery]: {
    maxWidth: rem(302),
    gridRow: `main-menu/-1`,
    gridColumn: 'main-menu/-2',
    visibility: 'hidden',
    display: 'none',
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
    display: 'flex',
  },
});

const mainMenuStyles = css({
  gridArea: 'main-menu',

  [drawerQuery]: {
    boxShadow: `0 -1px 0 ${steel.rgb}`, // instead of header border bottom
  },
});

export const searchButtonAreaStyles = css({
  gridArea: 'search-button',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${steel.rgb}`,
  borderLeft: `1px solid ${steel.rgb}`,
  // On desktop the search-button grid area no longer exists (the header spans
  // the full width); pin it to the top-right of the header row.
  [crossQuery]: {
    gridColumn: '3 / 4',
    gridRow: '1 / 2',
    zIndex: 1,
  },
  display: 'flex',
  svg: {
    fill: charcoal.rgb,
  },
  '& .active': {
    svg: {
      fill: success900.rgb,
    },
  },
  // Target the Navigation's inner div that renders the Search button
  // See https://asaphub.atlassian.net/browse/ASAP-1333
  // I'd rather have a property `overrideStyles` in `Navigation`, but
  // the problem is that even with that we won't be able to target the
  // `a` tag in it, so this custom override is needed.
  '& > a': {
    width: '100%',
    height: '100%',
  },
  '& > a > div': {
    padding: 0,
    height: '100%',
    width: '100%',
    justifyItems: 'center',
  },
});
const SearchIconStyles = css({
  width: rem(48),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
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
  maxHeight: '90vh',
  overflowY: 'scroll',
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
  ComponentProps<typeof UserNavigation> &
  ComponentProps<typeof UserMenuButton>;
const Layout: FC<LayoutProps> = ({
  children,
  onboardable,
  onboardModalHref,
  canViewAnalytics,
  ...userNavProps
}) => {
  // Mobile-only hamburger drawer (left side navigation)
  const [drawerShown, setDrawerShown] = useState(false);
  // Desktop user menu dropdown (top-right profile)
  const [userMenuShown, setUserMenuShown] = useState(false);
  // Desktop-only collapsed (icon-only) main navigation, persisted per user.
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(menuCollapsedStorageKey) === 'true';
    } catch {
      return false;
    }
  });
  // The menu (MainNavigation) is lazy-loaded behind Suspense. Keep the layout
  // expanded until it has mounted, otherwise the full-width loading shimmer
  // would overflow the narrow collapsed rail.
  const [menuLoaded, setMenuLoaded] = useState(false);
  const markMenuLoaded = useCallback(() => setMenuLoaded(true), []);
  // True while the rail is animating open; keeps nav labels hidden until the
  // rail reaches full width so they don't wrap inside a narrow column.
  const [menuAnimating, setMenuAnimating] = useState(false);
  const animateTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(
    () => () => {
      if (animateTimer.current) clearTimeout(animateTimer.current);
    },
    [],
  );
  const toggleMenuCollapsed = () =>
    setMenuCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(menuCollapsedStorageKey, String(next));
      } catch {
        // ignore storage failures (e.g. privacy mode); state still updates
      }
      // Flag the width transition in both directions so the icons stay
      // left-aligned (unmoved) while the rail animates; centring only snaps in
      // once the collapsed rail reaches its final width.
      setMenuAnimating(true);
      if (animateTimer.current) clearTimeout(animateTimer.current);
      animateTimer.current = setTimeout(
        () => setMenuAnimating(false),
        menuTransitionMs,
      );
      return next;
    });

  let location: ReturnType<typeof useLocation> | undefined;
  let prevLocation: ReturnType<typeof useLocation> | undefined;
  const mainRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  // This hook *is* called unconditionally despite what rules-of-hooks says
  /* eslint-disable react-hooks/rules-of-hooks */
  try {
    location = useLocation();
    prevLocation = usePrevious(location);
    useScrollToHash();
  } catch {
    // If there is no router, fine, never auto-close the menu
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  useEffect(() => {
    setDrawerShown(false);
    setUserMenuShown(false);
  }, [location]);

  useDismiss(
    [userButtonRef, userMenuRef],
    () => setUserMenuShown(false),
    userMenuShown,
  );
  useEffect(() => {
    if (location?.pathname !== prevLocation?.pathname && mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location, prevLocation, mainRef]);

  const scrollToTop = (options?: ScrollToOptions) => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
      ...options,
    });
  };

  return (
    <ToastStack>
      <article
        data-testid="layout-article-testid"
        css={[
          styles,
          menuCollapsed && menuLoaded && collapsedStyles,
          drawerShown || userMenuShown || { overflow: 'hidden' },
        ]}
      >
        {/* order relevant for overlap */}
        <div css={[headerStyles, drawerShown && headerMenuShownStyles]}>
          <MenuHeader
            enabled={userNavProps.userOnboarded}
            menuOpen={drawerShown}
            onToggleMenu={() => setDrawerShown((prev) => !prev)}
          />
        </div>
        <div css={userButtonStyles}>
          <Suspense fallback={<LoadingUserButton />}>
            <UserMenuButton
              ref={userButtonRef}
              onClick={() => setUserMenuShown((prev) => !prev)}
              open={userMenuShown}
              {...userNavProps}
            />
          </Suspense>
        </div>
        <div css={searchButtonAreaStyles}>
          <Navigation squareBorder href={tags({}).$}>
            <div css={SearchIconStyles}>{tagSearchIcon}</div>
          </Navigation>
        </div>
        <ScrollContext.Provider value={{ scrollToTop }}>
          <main ref={mainRef} css={contentStyles}>
            {children}
          </main>
        </ScrollContext.Provider>
        <div css={[overlayStyles, drawerShown && overlayMenuShownStyles]}>
          <Overlay shown={drawerShown} onClick={() => setDrawerShown(false)} />
        </div>
        <div css={[menuStyles, drawerShown && menuMenuShownStyles]}>
          <div css={[mainMenuStyles]}>
            <Suspense fallback={<LoadingMenu />}>
              {/* Runs only once the lazy chunk has resolved (never while the
                  fallback shows), marking the menu ready to collapse. */}
              <OnMount onMount={markMenuLoaded} />
              <MainNavigation
                userOnboarded={userNavProps.userOnboarded}
                canViewAnalytics={canViewAnalytics}
                collapsed={menuCollapsed}
                animating={menuAnimating}
                onToggleCollapse={toggleMenuCollapsed}
              />
            </Suspense>
          </div>
          <div
            css={[
              userMenuStyles,
              (drawerShown || userMenuShown) && userMenuShownStyles,
            ]}
            ref={userMenuRef}
          >
            <Suspense fallback={<Loading />}>
              <UserNavigation {...userNavProps} />
            </Suspense>
          </div>
        </div>
        {onboardable && (
          <div
            css={{ gridArea: 'footer', marginTop: networkContentTopPadding }}
          >
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
