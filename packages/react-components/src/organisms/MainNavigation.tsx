import { css } from '@emotion/react';
import {
  about,
  discover,
  network,
  sharedResearch,
  news,
  events,
  analytics,
} from '@asap-hub/routing';

import {
  perRem,
  vminLinearCalc,
  largeDesktopScreen,
  mobileScreen,
} from '../pixels';
import { NavigationLink } from '../atoms';
import {
  networkIcon,
  discoverIcon,
  aboutIcon,
  analyticsIcon,
  LibraryIcon,
  newsIcon,
  calendarIcon,
} from '../icons';
import { isEnabled } from '@asap-hub/flags';

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
  li: {
    marginBottom: '3px',
  },
});

export interface MainNavigationProps {
  readonly userOnboarded: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ userOnboarded }) => (
  <nav>
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
          icon={<LibraryIcon />}
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
          href={news({}).$}
          icon={newsIcon}
          enabled={userOnboarded}
        >
          News
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={discover({}).$}
          icon={discoverIcon}
          enabled={userOnboarded}
        >
          Guides &amp; Tutorials
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={about({}).$}
          icon={aboutIcon}
          enabled={userOnboarded}
        >
          About ASAP
        </NavigationLink>
      </li>
      {isEnabled('ANALYTICS') && (
        <li>
          <NavigationLink
            href={analytics({}).$}
            icon={analyticsIcon}
            enabled={userOnboarded}
          >
            Analytics
          </NavigationLink>
        </li>
      )}
    </ul>
  </nav>
);

export default MainNavigation;
