import { gp2 as gp2Model } from '@asap-hub/model';
import { css } from '@emotion/react';
import { logout, gp2 as gp2Routing } from '@asap-hub/routing';

import {
  NavigationLink,
  pixels,
  logoutIcon,
  Divider,
} from '@asap-hub/react-components';

const { vminLinearCalc, mobileScreen, largeDesktopScreen, rem } = pixels;
const { projects: projectsRoute, workingGroups: workingGroupRoute } =
  gp2Routing;

const containerStyles = css({
  minWidth: '312px',
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
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

type UserMenuProps = Pick<gp2Model.UserResponse, 'projects' | 'workingGroups'>;
const UserMenu: React.FC<UserMenuProps> = ({ projects, workingGroups }) => (
  <nav css={containerStyles}>
    {(workingGroups.length > 0 || projects.length > 0) && (
      <>
        <ul css={listStyles}>
          {projects
            .filter(({ status }) => status === 'Active')
            .map(({ id, title }) => (
              <li key={`user-menu-project-${id}`}>
                <NavigationLink
                  href={projectsRoute({}).project({ projectId: id }).$}
                  icon={logoutIcon}
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
                icon={logoutIcon}
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

export default UserMenu;
