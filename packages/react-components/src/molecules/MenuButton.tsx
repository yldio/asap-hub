import React from 'react';
import css from '@emotion/css';

import { noop } from '../utils';

const buttonResetStyles = css({
  padding: 0,
  border: 'none',
  outline: 'none',
});

interface MenuButtonProps {
  onClick?: () => void;
}
const MenuButton: React.FC<MenuButtonProps> = ({ onClick = noop }) => (
  <button
    aria-label="Toggle Menu"
    css={[buttonResetStyles]}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
  >
    TODO Menu Button
  </button>
);
export default MenuButton;
