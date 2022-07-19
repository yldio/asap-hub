import { css } from '@emotion/react';
import {
  discover,
  network,
  sharedResearch,
  news,
  events,
} from '@asap-hub/routing';

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
  readonly userOnboarded: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ userOnboarded }) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink
          href={network({}).$}
          icon={networkIcon}
          enabled={userOnboarded}
        >
          Network
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={sharedResearch({}).$}
          icon={libraryIcon}
          enabled={userOnboarded}
        >
          Shared Research
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={events({}).$}
          icon={calendarIcon}
          enabled={userOnboarded}
        >
          Calendar &amp; Events
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={discover({}).$}
          icon={discoverIcon}
          enabled={userOnboarded}
        >
          Discover ASAP
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={news({}).$}
          icon={newsIcon}
          enabled={userOnboarded}
        >
          News
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
