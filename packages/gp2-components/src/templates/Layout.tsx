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
  ToastStack,
  navigationGrey,
  crossQuery,
  drawerQuery,
  usePrevious,
  MainNavigation,
  ceruleanFernGradientStyles,
} from '@asap-hub/react-components';
import UserNavigation from '../organism/UserNavigation';

import NavigationHeader from '../organism/NavigationHeader';
import { smallDesktopQuery } from '../layout';

const userMenuStyles = css({
  backgroundColor: paper.rgb,
  gridArea: 'user-menu',
  flexGrow: 1,

  display: 'none',
  position: 'absolute',
  transform: 'translateX(calc(1100px - 100%))',
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  [smallDesktopQuery]: {
    transform: 'translateX(calc(880px - 100%))',
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
} & ComponentProps<typeof MainNavigation> &
  ComponentProps<typeof UserNavigation>;
const Layout: FC<LayoutProps> = ({ children, ...userNavProps }) => {
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
      <article css={css({ width: '100%' })}>
        <NavigationHeader
          menuOpen={menuShown}
          onToggleMenu={() => {
            setMenuShown(!menuShown);
          }}
        />
        <div
          css={[
            ceruleanFernGradientStyles,
            css({ height: '4px', width: '100%' }),
          ]}
        ></div>
        {/* {
          <div css={css([userMenuStyles, menuShown && userMenuShownStyles])}>
            <UserNavigation />
          </div>
        } */}
      </article>
      <article>
        <main ref={mainRef}>{children}</main>
      </article>
    </ToastStack>
  );
};

export default Layout;
