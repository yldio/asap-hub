import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  largeDesktopScreen,
  mobileScreen,
  smallDesktopScreen,
} from '../pixels';
import { NavigationLink } from '../atoms';
import { networkIcon, libraryIcon, newsIcon } from '../icons';

const containerStyles = css({
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
});

const listStyles = css({
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

export interface MainNavigationProps {
  networkHref: string;
  libraryHref: string;
  newsAndEventsHref: string;
}
const MainNavigation: React.FC<MainNavigationProps> = ({
  networkHref,
  libraryHref,
  newsAndEventsHref,
}) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={networkHref} icon={networkIcon}>
          Network
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={libraryHref} icon={libraryIcon}>
          Library
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={newsAndEventsHref} icon={newsIcon}>
          News and Events
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
