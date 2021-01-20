import React from 'react';
import css from '@emotion/css';
import { isEnabled } from '@asap-hub/flags';

import {
  perRem,
  vminLinearCalc,
  largeDesktopScreen,
  mobileScreen,
  smallDesktopScreen,
} from '../pixels';
import { NavigationLink } from '../atoms';
import {
  networkIcon,
  discoverIcon,
  libraryIcon,
  newsIcon,
  calendarIcon,
} from '../icons';

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
  discoverAsapHref: string;
  sharedResearchHref: string;
  networkHref: string;
  newsAndEventsHref: string;
  eventsHref: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  discoverAsapHref,
  sharedResearchHref,
  networkHref,
  newsAndEventsHref,
  eventsHref,
}) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={networkHref} icon={networkIcon}>
          Network
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={sharedResearchHref} icon={libraryIcon}>
          Shared Research
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={newsAndEventsHref} icon={newsIcon}>
          {isEnabled('EVENTS_PAGE') ? 'News' : 'News and Events'}
        </NavigationLink>
      </li>
      {isEnabled('EVENTS_PAGE') && (
        <li>
          <NavigationLink href={eventsHref} icon={calendarIcon}>
            Calendar and Events
          </NavigationLink>
        </li>
      )}
      <li>
        <NavigationLink href={discoverAsapHref} icon={discoverIcon}>
          Discover ASAP
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
