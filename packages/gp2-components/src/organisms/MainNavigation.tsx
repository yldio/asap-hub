import { drawerQuery, pixels } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import {
  eventsIcon,
  outputsIcon,
  projectIcon,
  userIcon,
  workingGroupIcon,
} from '../icons';
import newsIcon from '../icons/news-icon';
import NavigationLink from '../molecules/NavigationLink';

const { workingGroups, users, projects, outputs, events, newsList } = gp2;
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
  gap: rem(16),
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
        <NavigationLink href={users({}).$} icon={userIcon}>
          People
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={workingGroups({}).$}
          icon={workingGroupIcon}
          enabled={true}
        >
          Groups
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={projects({}).$} icon={projectIcon}>
          Projects
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={outputs({}).$} icon={outputsIcon}>
          Outputs
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={events({}).$} icon={eventsIcon}>
          Events
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={newsList({}).$} icon={newsIcon}>
          News
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
