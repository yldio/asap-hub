import {
  discoverIcon,
  NavigationLink,
  networkIcon,
  pixels,
} from '@asap-hub/react-components';

import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';

const { perRem, vminLinearCalc, mobileScreen, largeDesktopScreen } = pixels;

const listStyles = css({
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  margin: 0,
  boxSizing: 'border-box',
  padding: `${12 / perRem}em`,
  paddingTop: `max(${12 / perRem}em, ${vminLinearCalc(
    mobileScreen,
    18 / perRem,
    largeDesktopScreen,
    12 / perRem,
    'em',
  )})`,
});

const MainNavigation: React.FC = () => (
  <nav>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={'/'} icon={discoverIcon}>
          Home
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={networkIcon}>
          Network
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
