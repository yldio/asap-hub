import { css } from '@emotion/react';
import { logout } from '@asap-hub/routing';

import { NavigationLink, pixels, logoutIcon } from '@asap-hub/react-components';

const { vminLinearCalc, mobileScreen, largeDesktopScreen, rem } = pixels;

const containerStyles = css({
  minWidth: '312px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: `${rem(12)} ${rem(12)} ${vminLinearCalc(
    mobileScreen,
    8,
    largeDesktopScreen,
    12,
    'px',
  )}`,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const UserMenu: React.FC = () => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={logout({}).$} icon={logoutIcon}>
          Log Out
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default UserMenu;
