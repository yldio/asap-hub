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
        <NavigationLink href={'/'}>
          <div
            css={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            })}
          >
            {discoverIcon}Home
          </div>
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$}>
          <div
            css={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            })}
          >
            {networkIcon}Network
          </div>
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
