import {
  crossQuery,
  MenuButton,
  steel,
  UserMenuButton,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import React from 'react';
import HeaderLogo from '../molecules/HeaderLogo';
import MainNavigation from './MainNavigation';

const menuButtonWidth = 72;

const styles = css({
  display: 'flex',
  flexDirection: 'row',
  margin: 'auto',
  [crossQuery]: {
    alignItems: 'flex-start',
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
  <header css={styles}>
    <div css={[menuButtonStyles]}>
      <MenuButton open={menuOpen} onClick={() => onToggleMenu()} />
    </div>
    <HeaderLogo />
    <MainNavigation />
    <UserMenuButton />
    <div role="presentation" css={[headerSpaceStyles]} />
  </header>
);
export default NavigationHeader;
