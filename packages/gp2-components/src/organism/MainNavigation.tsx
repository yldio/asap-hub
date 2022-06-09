import {
  discoverIcon,
  networkIcon,
  pixels,
  teamIcon,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import NavigationLink from '../molecules/NavigationLink';
const { rem } = pixels;
const listStyles = css({
  margin: '0',
  padding: '0',
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  gap: rem(48),
});

const MainNavigation: React.FC = () => (
  <nav>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={'/'} icon={discoverIcon}>
          Dashboard
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={networkIcon} enabled={false}>
          Directory
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={teamIcon} enabled={false}>
          Projects
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
