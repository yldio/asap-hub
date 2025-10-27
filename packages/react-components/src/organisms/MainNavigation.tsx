import { css } from '@emotion/react';
import {
  about,
  discover,
  network,
  projects,
  sharedResearch,
  news,
  events,
  analytics,
} from '@asap-hub/routing';

import {
  rem,
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
  projectIcon,
} from '../icons';

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  boxSizing: 'border-box',
  padding: rem(12),
  paddingTop: `max(${rem(12)}, ${vminLinearCalc(
    mobileScreen,
    18,
    largeDesktopScreen,
    12,
    'px',
  )})`,
  li: {
    marginBottom: '3px',
  },
});

export interface MainNavigationProps {
  readonly userOnboarded: boolean;
  readonly canViewAnalytics?: boolean;
  readonly canViewProjects?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  userOnboarded,
  canViewAnalytics = false,
  canViewProjects = false,
}) => (
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
      {canViewProjects && (
        <li>
          <NavigationLink
            href={projects({}).$}
            icon={projectIcon}
            enabled={userOnboarded}
          >
            Projects
          </NavigationLink>
        </li>
      )}
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
      {canViewAnalytics && (
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
