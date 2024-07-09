import { css } from '@emotion/react';
import {
  aboutRoutes,
  discoverRoutes,
  networkRoutes,
  sharedResearchRoutes,
  newsRoutes,
  eventRoutes,
  analyticsRoutes,
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
  readonly canViewAnalytics?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  userOnboarded,
  canViewAnalytics = false,
}) => (
  <nav>
    <ul css={listStyles}>
      <li>
        <NavigationLink
          href={networkRoutes.DEFAULT.buildPath({})}
          icon={networkIcon}
          enabled={userOnboarded}
        >
          Network
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={sharedResearchRoutes.DEFAULT.LIST.buildPath({})}
          icon={<LibraryIcon />}
          enabled={userOnboarded}
        >
          Shared Research
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={eventRoutes.DEFAULT.buildPath({})}
          icon={calendarIcon}
          enabled={userOnboarded}
        >
          Calendar &amp; Events
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={newsRoutes.DEFAULT.LIST.buildPath({})}
          icon={newsIcon}
          enabled={userOnboarded}
        >
          News
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={discoverRoutes.DEFAULT.LIST.buildPath({})}
          icon={discoverIcon}
          enabled={userOnboarded}
        >
          Guides &amp; Tutorials
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={aboutRoutes.buildPath({})}
          icon={aboutIcon}
          enabled={userOnboarded}
        >
          About ASAP
        </NavigationLink>
      </li>
      {canViewAnalytics && (
        <li>
          <NavigationLink
            href={analyticsRoutes.DEFAULT.buildPath({})}
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
