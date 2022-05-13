import {
  crossQuery,
  drawerQuery,
  MenuButton,
  steel,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import React from 'react';
import { smallDesktopQuery } from '../layout';
import HeaderLogo from '../molecules/HeaderLogo';
import MainNavigation from './MainNavigation';
import UserNavigation from './UserNavigation';

const menuButtonWidth = 72;

const styles = css({
  padding: 0,
  display: 'flex',
  flexDirection: 'row',
  maxWidth: '1100px',
  justifyContent: 'center',
  alignItems: 'center',
  [smallDesktopQuery]: {
    maxWidth: '880px',
  },
  gap: '72px',
  margin: 'auto',
  [drawerQuery]: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: '24px',
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const menuButtonStyles = css({
  [crossQuery]: {
    display: 'none',
  },

  width: `${menuButtonWidth}px`,
  boxSizing: 'content-box',
  borderRight: `1px solid ${steel.rgb}`,

  display: 'flex',
  justifyContent: 'stretch',
  alignItems: 'stretch',
});
const headerSpaceStyles = css({
  width: `${menuButtonWidth}px`,
  [crossQuery]: {
    display: 'none',
  },
});

interface NavigationHeaderProps {
  enabled?: boolean;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
}
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  enabled = true,
  menuOpen = false,
  onToggleMenu = (): void => {},
}) => (
  <header css={[styles]}>
    <div css={[menuButtonStyles]}>
      <MenuButton open={menuOpen} onClick={() => onToggleMenu()} />
    </div>
    <HeaderLogo />
    <div
      css={css({
        [drawerQuery]: {
          display: 'none',
        },
      })}
    >
      <MainNavigation />
    </div>
    <div
      css={css({
        [drawerQuery]: {
          display: 'none',
        },
      })}
    >
      <UserNavigation />
    </div>

    <div role="presentation" css={[headerSpaceStyles]} />
  </header>
);
export default NavigationHeader;
