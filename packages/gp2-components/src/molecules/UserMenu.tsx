import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, logout } from '@asap-hub/routing';
import { css } from '@emotion/react';

import {
  Divider,
  logoutIcon,
  NavigationLink,
  pixels,
} from '@asap-hub/react-components';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { useEffect } from 'react';
import { workingGroupIcon, projectIcon, userIcon } from '../icons';
import { nonMobileQuery } from '../layout';

const { vminLinearCalc, mobileScreen, largeDesktopScreen, rem } = pixels;
const {
  users: usersRoutes,
  projects: projectsRoute,
  workingGroups: workingGroupRoute,
} = gp2Routing;

const containerStyles = css({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: `${rem(12)} ${rem(12)} ${vminLinearCalc(
    mobileScreen,
    8,
    largeDesktopScreen,
    12,
    'px',
  )}`,
  [nonMobileQuery]: {
    minWidth: '312px',
  },
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

type UserMenuProps = Pick<
  gp2Model.UserResponse,
  'projects' | 'workingGroups'
> & {
  closeUserMenu: (showMenu: boolean) => void;
  userId: string;
};

const UserMenu: React.FC<UserMenuProps> = ({
  userId,
  projects,
  workingGroups,
  closeUserMenu,
}) => {
  let location: Location | undefined;

  // This hook *is* called unconditionally despite what rules-of-hooks says
  /* eslint-disable react-hooks/rules-of-hooks */
  try {
    location = useLocation();
  } catch {
    // If there is no router, fine, never auto-close the menu
  }
  /* eslint-enable react-hooks/rules-of-hooks */
  useEffect(() => {
    closeUserMenu(false);
  }, [closeUserMenu, location]);

  return (
    <nav css={containerStyles}>
      <ul css={listStyles}>
        <li>
          <NavigationLink
            href={usersRoutes({}).user({ userId }).$}
            icon={userIcon}
          >
            My Profile
          </NavigationLink>
        </li>
      </ul>
      {(workingGroups.length > 0 || projects.length > 0) && (
        <>
          <ul css={listStyles}>
            {projects
              .filter(({ status }) => status === 'Active')
              .map(({ id, title }) => (
                <li key={`user-menu-project-${id}`}>
                  <NavigationLink
                    href={projectsRoute({}).project({ projectId: id }).$}
                    icon={projectIcon}
                  >
                    My project: {title}
                  </NavigationLink>
                </li>
              ))}
            {workingGroups.map(({ id, title }) => (
              <li key={`user-menu-working-group-${id}`}>
                <NavigationLink
                  href={
                    workingGroupRoute({}).workingGroup({ workingGroupId: id }).$
                  }
                  icon={workingGroupIcon}
                >
                  My working group: {title}
                </NavigationLink>
              </li>
            ))}
          </ul>
          <Divider />
        </>
      )}
      <ul css={listStyles}>
        <li>
          <NavigationLink href={logout({}).$} icon={logoutIcon}>
            Log Out
          </NavigationLink>
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
