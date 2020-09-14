import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  largeDesktopScreen,
  mobileScreen,
} from '../pixels';
import { NavigationLink } from '../atoms';
import { networkIcon, libraryIcon, newsIcon } from '../icons';

const width = `max(258px, ${vminLinearCalc(
  mobileScreen,
  312,
  largeDesktopScreen,
  258,
  'px',
)})`;

const containerStyles = css({
  width,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,

  width,

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

const listItemStyles = css({});

interface MainNavigationProps {
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
      <li css={listItemStyles}>
        <NavigationLink href={networkHref} icon={networkIcon}>
          Network
        </NavigationLink>
      </li>
      <li css={listItemStyles}>
        <NavigationLink href={libraryHref} icon={libraryIcon}>
          Library
        </NavigationLink>
      </li>
      <li css={listItemStyles}>
        <NavigationLink href={newsAndEventsHref} icon={newsIcon}>
          News and Events
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
