import React from 'react';
import css from '@emotion/css';

import { noop } from '../utils';
import { menuIcon } from '../icons';
import { perRem } from '../pixels';

const buttonResetStyles = css({
  margin: 0,
  padding: 0,
  backgroundColor: 'unset',
  border: 'none',
  outline: 'none',
});
const styles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const iconStyles = css({
  width: `${30 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
});

interface MenuButtonProps {
  onClick?: () => void;
}
const MenuButton: React.FC<MenuButtonProps> = ({ onClick = noop }) => (
  <button
    aria-label="Toggle Menu"
    css={[buttonResetStyles, styles]}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
  >
    <div css={iconStyles}>{menuIcon}</div>
  </button>
);

export default MenuButton;
