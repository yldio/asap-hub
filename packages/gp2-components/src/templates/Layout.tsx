import {
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
  ToastStack,
  usePrevious,
  MainNavigation,
  drawerQuery,
} from '@asap-hub/react-components';

import NavigationHeader from '../organism/NavigationHeader';
import {
  mobileScreen,
  tabletScreen,
  vminLinearCalcClamped,
} from '@asap-hub/react-components/src/pixels';

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

type LayoutProps = {
  readonly children: ReactNode;
} & ComponentProps<typeof MainNavigation>;
const Layout: FC<LayoutProps> = ({ children }) => {
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
      </article>
      <article css={contentStyles}>
        <main ref={mainRef}>{children}</main>
      </article>
    </ToastStack>
  );
};

export default Layout;
