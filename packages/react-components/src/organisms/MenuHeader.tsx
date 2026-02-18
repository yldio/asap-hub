import { css } from '@emotion/react';

import { steel } from '../colors';
import { crossQuery } from '../layout';
import { Header, MenuButton } from '../molecules';
import { noop } from '../utils';

const menuButtonWidth = 72;

export const styles = css({
  display: 'flex',
  [crossQuery]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export const menuButtonStyles = css({
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

interface MenuHeaderProps {
  enabled?: boolean;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
}
const MenuHeader: React.FC<MenuHeaderProps> = ({
  enabled = true,
  menuOpen = false,
  onToggleMenu = noop,
}) => (
  <div css={styles} data-testid="menu-header-testid">
    <div css={[menuButtonStyles]}>
      <MenuButton open={menuOpen} onClick={() => onToggleMenu()} />
    </div>
    <Header enabled={enabled} logoAlignment="center" />
  </div>
);
export default MenuHeader;
