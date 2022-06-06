import { useState, FC, ReactNode } from 'react';
import { css } from '@emotion/react';

import { ToastStack, drawerQuery } from '@asap-hub/react-components';
import {
  mobileScreen,
  tabletScreen,
  vminLinearCalcClamped,
} from '@asap-hub/react-components/src/pixels';

import NavigationHeader from '../organism/NavigationHeader';

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
};
const Layout: FC<LayoutProps> = ({ children }) => {
  const [menuShown, setMenuShown] = useState(false);

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
      <article css={contentStyles}>{children}</article>
    </ToastStack>
  );
};

export default Layout;
