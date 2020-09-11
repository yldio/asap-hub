import React from 'react';
import css from '@emotion/css';
import { useCurrentUser } from '@asap-hub/react-context';

import { noop } from '../utils';
import { perRem } from '../pixels';
import { Paragraph, Avatar } from '../atoms';
import { chevronDownIcon, chevronUpIcon } from '../icons';

const buttonResetStyles = css({
  padding: 0,
  backgroundColor: 'unset',
  border: 'none',
  outline: 'none',
});
const styles = css({
  padding: `${12 / perRem}em ${24 / perRem}em`,
  cursor: 'pointer',

  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  gridColumnGap: `${15 / perRem}em`,
  alignItems: 'center',
});

interface UserMenuButtonProps {
  onClick?: () => void;
  open?: boolean;
}
const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  onClick = noop,
  open = false,
}) => {
  const {
    displayName = 'Unknown User',
    firstName = 'Unknown',
    lastName = 'User',
    avatarURL,
  } = useCurrentUser() ?? {};

  return (
    <button
      aria-label="Toggle User Menu"
      css={[buttonResetStyles, styles]}
      onClick={(event) => {
        onClick();
        event.preventDefault();
      }}
    >
      <Paragraph>
        <strong>{displayName}</strong>
      </Paragraph>
      <Avatar
        small
        imageUrl={avatarURL}
        firstName={firstName}
        lastName={lastName}
      />
      {open ? chevronUpIcon : chevronDownIcon}
    </button>
  );
};

export default UserMenuButton;
