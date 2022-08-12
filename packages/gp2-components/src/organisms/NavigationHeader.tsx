import {
  ceruleanFernGradientStyles,
  crossQuery,
  drawerQuery,
  MenuButton,
  steel,
  pixels,
  noop,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { smallDesktopQuery } from '../layout';
import HeaderLogo from '../molecules/HeaderLogo';
import MainNavigation from './MainNavigation';
import UserNavigation from './UserNavigation';

const { rem } = pixels;
const menuButtonWidth = 72;

const navigationHeaderstyles = css({
  padding: 0,
  display: 'flex',
  flexDirection: 'row',
  maxWidth: '1100px',
  justifyContent: 'center',
  alignItems: 'center',
  [smallDesktopQuery]: {
    maxWidth: '880px',
  },
  gap: rem(72),
  margin: 'auto',
  [drawerQuery]: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: rem(24),
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

const desktopNavigationStyles = css({
  [drawerQuery]: {
    display: 'none',
  },
});

const bottomBorderStyles = css({
  height: rem(4),
  width: '100%',
  ...ceruleanFernGradientStyles,
});

interface NavigationHeaderProps {
  menuOpen?: boolean;
  onToggleMenu?: () => void;
}
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  menuOpen = false,
  onToggleMenu = noop,
}) => (
  <header>
    <div css={[navigationHeaderstyles]}>
      <div css={[menuButtonStyles]}>
        <MenuButton open={menuOpen} onClick={() => onToggleMenu()} />
      </div>
      <HeaderLogo />
      <div css={desktopNavigationStyles}>
        <MainNavigation />
      </div>

      <div css={desktopNavigationStyles}>
        <UserNavigation />
      </div>
    </div>
    <div css={[bottomBorderStyles, desktopNavigationStyles]} />
  </header>
);
export default NavigationHeader;
