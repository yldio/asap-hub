import { drawerQuery, pixels } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import DashboardIcon from '../icons/dashboard-icon';
import ProjectIcon from '../icons/project-icon';
import UsersIcon from '../icons/users-icon';
import WorkingGroupIcon from '../icons/working-group-icon';
import NavigationLink from '../molecules/NavigationLink';

const { workingGroups, users, projects } = gp2;
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
        <NavigationLink
          href={'/'}
          icon={<DashboardIcon color={'currentColor'} />}
          hasStroke={false}
        >
          Dashboard
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={users({}).$}
          icon={<UsersIcon color={'currentColor'} />}
          hasStroke={false}
        >
          Users
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={workingGroups({}).$}
          icon={<WorkingGroupIcon color={'currentColor'} />}
          hasStroke={false}
          enabled={true}
        >
          Groups
        </NavigationLink>
      </li>
      <li>
        <NavigationLink
          href={projects({}).$}
          icon={<ProjectIcon color={'currentColor'} />}
          hasStroke={false}
        >
          Projects
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
