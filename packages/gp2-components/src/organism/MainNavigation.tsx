import {
  discoverIcon,
  drawerQuery,
  networkIcon,
  pixels,
  teamIcon,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import NavigationLink from '../molecules/NavigationLink';

const {
  largeDesktopScreen,
  mobileScreen,
  perRem,
  vminLinearCalc,
  rem,
  smallDesktopScreen,
} = pixels;

const containerStyles = css({
  [drawerQuery]: {
    minWidth: `max(${vminLinearCalc(
      mobileScreen,
      312,
      smallDesktopScreen,
      228,
      'px',
    )}, ${vminLinearCalc(
      smallDesktopScreen,
      228,
      largeDesktopScreen,
      258,
      'px',
    )})`,
  },
});

const listStyles = css({
  margin: '0',
  padding: '0',
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  gap: rem(48),
  [drawerQuery]: {
    flexDirection: 'column',
    gap: 0,
    padding: rem(12),
    paddingTop: `max(${rem(12)}, ${vminLinearCalc(
      mobileScreen,
      18 / perRem,
      largeDesktopScreen,
      12 / perRem,
      'em',
    )})`,
  },
});

const MainNavigation: React.FC = () => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={'/'} icon={discoverIcon}>
          Dashboard
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={networkIcon} enabled={false}>
          Directory
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={teamIcon} enabled={false}>
          Projects
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
