import React from 'react';
import css from '@emotion/css';

import { noop } from '../utils';
import { MenuButton, Header } from '../molecules';
import { tabletScreen } from '../pixels';

const styles = css({
  display: 'flex',
});

const menuButtonWidth = 72;
const hideButtonQuery = `@media (min-width: ${tabletScreen.width}px)`;

const menuButtonStyles = css({
  [hideButtonQuery]: {
    display: 'none',
  },
  width: `${menuButtonWidth}px`,

  display: 'flex',
  alignItems: 'center',
});
const headerSpaceStyles = css({
  [hideButtonQuery]: {
    display: 'none',
  },
  width: `${menuButtonWidth}px`,
});

interface MenuHeaderProps {
  onToggleMenu?: () => void;
}
const MenuHeader: React.FC<MenuHeaderProps> = ({ onToggleMenu = noop }) => (
  <div css={styles}>
    <div css={[menuButtonStyles]}>
      <MenuButton onClick={() => onToggleMenu()} />
    </div>
    <Header />
    <div role="presentation" css={[headerSpaceStyles]} />
  </div>
);
export default MenuHeader;
