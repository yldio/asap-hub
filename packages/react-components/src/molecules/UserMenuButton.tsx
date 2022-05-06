import { css } from '@emotion/react';
import { useCurrentUser } from '@asap-hub/react-context';

import { noop } from '../utils';
import { perRem } from '../pixels';
import { Paragraph, Avatar } from '../atoms';
import { chevronDownIcon, chevronUpIcon, verticalDividerIcon } from '../icons';
import { TextChild } from '../text';

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
  gridTemplateColumns: `auto ${48 / perRem}em auto auto`,
  alignItems: 'center',
});

interface UserMenuButtonProps {
  onClick?: () => void;
  open?: boolean;
  children?: TextChild;
  hideText?: boolean;
}
const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  onClick = noop,
  open = false,
  children,
}) => {
  const {
    displayName = 'Unknown User',
    firstName = 'Unknown',
    lastName = 'User',
    avatarUrl,
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
        <strong css={{ paddingRight: `${15 / perRem}em` }}>
          {children ? children : displayName}
        </strong>
      </Paragraph>
      <Avatar imageUrl={avatarUrl} firstName={firstName} lastName={lastName} />
      <div
        css={{
          paddingLeft: `${12 / perRem}em`,
          paddingRight: `${9 / perRem}em`,
        }}
      >
        {verticalDividerIcon}
      </div>
      {open ? chevronUpIcon : chevronDownIcon}
    </button>
  );
};

export default UserMenuButton;
