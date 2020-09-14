import React from 'react';
import css from '@emotion/css';

import { noop } from '../utils';
import { MenuButton, Header } from '../molecules';
import { layoutCrossQuery } from '../pixels';
import { steel } from '../colors';

const menuButtonWidth = 72;

const styles = css({
  display: 'flex',
  [layoutCrossQuery]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const menuButtonStyles = css({
  [layoutCrossQuery]: {
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
  [layoutCrossQuery]: {
    display: 'none',
  },
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
