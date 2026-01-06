import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { Avatar, Paragraph } from '../atoms';
import { chevronDownIcon, chevronUpIcon, verticalDividerIcon } from '../icons';
import { rem } from '../pixels';
import { noop } from '../utils';

const buttonResetStyles = css({
  padding: 0,
  backgroundColor: 'unset',
  border: 'none',
  outline: 'none',
});
const styles = css({
  padding: `${rem(12)} ${rem(24)}`,
  cursor: 'pointer',

  display: 'grid',
  gridTemplateColumns: `auto ${rem(48)} auto auto`,
  alignItems: 'center',
});

type AvatarProps = ComponentProps<typeof Avatar>;
type UserMenuButtonProps = {
  onClick?: () => void;
  open?: boolean;
  displayName?: string;
  children?: React.ReactNode;
} & {
  [K in keyof AvatarProps as K extends 'imageUrl'
    ? 'avatarUrl'
    : K]: AvatarProps[K];
};
const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  onClick = noop,
  open = false,
  displayName = 'Unknown User',
  firstName = 'Unknown',
  lastName = 'User',
  avatarUrl,
  children,
}) => (
  <button
    aria-label="Toggle User Menu"
    css={[buttonResetStyles, styles]}
    onClick={(event) => {
      onClick();
      event.preventDefault();
    }}
  >
    <Paragraph>
      <strong css={{ paddingRight: rem(15) }}>{children || displayName}</strong>
    </Paragraph>
    <Avatar imageUrl={avatarUrl} firstName={firstName} lastName={lastName} />
    <div
      css={{
        paddingLeft: rem(12),
        paddingRight: rem(9),
      }}
    >
      {verticalDividerIcon}
    </div>
    {open ? chevronUpIcon : chevronDownIcon}
  </button>
);

export default UserMenuButton;
