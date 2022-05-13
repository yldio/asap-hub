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
  ceruleanFernGradientStyles,
} from '@asap-hub/react-components';

import NavigationHeader from '../organism/NavigationHeader';

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
        <div
          css={[
            ceruleanFernGradientStyles,
            css({ height: '4px', width: '100%' }),
          ]}
        ></div>
      </article>
      <article>
        <main ref={mainRef}>{children}</main>
      </article>
    </ToastStack>
  );
};

export default Layout;
