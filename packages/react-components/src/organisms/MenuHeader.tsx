import { css } from '@emotion/react';

import { noop } from '../utils';
import { MenuButton, Header } from '../molecules';
import { crossQuery } from '../layout';
import { steel } from '../colors';

const menuButtonWidth = 72;

const styles = css({
  display: 'flex',
  [crossQuery]: {
    flexDirection: 'column',
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

interface MenuHeaderProps {
  menuOpen?: boolean;
  onToggleMenu?: () => void;
}
const MenuHeader: React.FC<MenuHeaderProps> = ({
  menuOpen = false,
  onToggleMenu = noop,
}) => (
  <div css={styles}>
    <div css={[menuButtonStyles]}>
      <MenuButton open={menuOpen} onClick={() => onToggleMenu()} />
    </div>
    <Header />
    <div role="presentation" css={[headerSpaceStyles]} />
  </div>
);
export default MenuHeader;
