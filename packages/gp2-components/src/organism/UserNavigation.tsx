import { css } from '@emotion/react';
import { logout } from '@asap-hub/routing';

import { NavigationLink, pixels, logoutIcon } from '@asap-hub/react-components';

const { perRem, vminLinearCalc, mobileScreen, largeDesktopScreen } = pixels;

const containerStyles = css({
  minWidth: '312px',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${12 / perRem}em ${12 / perRem}em ${vminLinearCalc(
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

export interface UserNavigationProps {
  readonly userOnboarded?: boolean;
  readonly userProfileHref: string;
  readonly teams: ReadonlyArray<{ name: string; href: string }>;
  readonly aboutHref: string;
}
const UserNavigation: React.FC<UserNavigationProps> = ({}) => (
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

export default UserNavigation;
