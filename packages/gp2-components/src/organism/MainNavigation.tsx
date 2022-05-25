import { discoverIcon, networkIcon } from '@asap-hub/react-components';

import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import NavigationLink from '../molecules/NavigationLink';

// const { perRem, vminLinearCalc, mobileScreen, largeDesktopScreen } = pixels;

const listStyles = css({
  margin: '0',
  padding: '0',
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  gap: '48px',
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
