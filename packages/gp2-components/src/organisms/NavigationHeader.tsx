import {
  ceruleanFernGradientStyles,
  crossQuery,
  drawerQuery,
  MenuButton,
  steel,
  pixels,
  noop,
  Anchor,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { gp2LogoSmall } from '../icons';
import MainNavigation from './MainNavigation';
import UserNavigation from './UserNavigation';

const { rem } = pixels;
const menuButtonWidth = 72;

const navigationHeaderstyles = css({
  padding: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: rem(72),
  margin: `0 ${rem(24)}`,
  [drawerQuery]: {
    margin: 0,
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

type NavigationHeaderProps = {
  menuShown: boolean;
  onToggleMenu: (menuOpen: boolean) => void;
} & ComponentProps<typeof UserNavigation>;
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  menuShown,
  onToggleMenu = noop,
  ...userNavigationProps
}) => (
  <header>
    <div css={[navigationHeaderstyles]}>
      <div css={[menuButtonStyles]}>
        <MenuButton open={menuShown} onClick={() => onToggleMenu(!menuShown)} />
      </div>
      <Anchor
        css={{
          display: 'flex',
          padding: `${rem(16)} 0`,
        }}
        href={'/'}
      >
        {gp2LogoSmall}
      </Anchor>
      <div css={desktopNavigationStyles}>
        <MainNavigation />
      </div>

      <div css={desktopNavigationStyles}>
        <UserNavigation {...userNavigationProps} />
      </div>
    </div>
    <div css={[bottomBorderStyles, desktopNavigationStyles]} />
  </header>
);
export default NavigationHeader;
