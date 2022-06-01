import { discoverIcon, networkIcon } from '@asap-hub/react-components';
import { rem } from '@asap-hub/react-components/src/pixels';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import NavigationLink from '../molecules/NavigationLink';

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
          Home
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={network({}).$} icon={networkIcon}>
          Network
        </NavigationLink>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
