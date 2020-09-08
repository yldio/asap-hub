import React from 'react';
import css from '@emotion/css';

import { noop } from '../utils';

const buttonResetStyles = css({
  padding: 0,
  border: 'none',
  outline: 'none',
});

interface UserMenuButtonProps {
  onClick?: () => void;
}
const UserMenuButton: React.FC<UserMenuButtonProps> = ({ onClick = noop }) => (
  <button
    aria-label="Toggle User Menu"
    css={[buttonResetStyles]}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
  >
    TODO User Menu Button
  </button>
);

export default UserMenuButton;
