import { css } from '@emotion/react';

import { noop } from '../utils';
import { menuIcon, crossIcon } from '../icons';
import { rem } from '../pixels';

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
  width: rem(30),
  display: 'flex',
  justifyContent: 'center',
});

interface MenuButtonProps {
  open?: boolean;
  onClick?: () => void;
}
const MenuButton: React.FC<MenuButtonProps> = ({
  open = false,
  onClick = noop,
}) => (
  <button
    aria-label="Toggle Menu"
    css={[buttonResetStyles, styles]}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
  >
    <div css={iconStyles}>{open ? crossIcon : menuIcon}</div>
  </button>
);

export default MenuButton;
