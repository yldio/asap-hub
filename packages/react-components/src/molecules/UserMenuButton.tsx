import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { Avatar, Paragraph } from '../atoms';
import { chevronDownIcon, chevronUpIcon, verticalDividerIcon } from '../icons';
import { perRem } from '../pixels';
import { noop } from '../utils';

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

type AvatarProps = ComponentProps<typeof Avatar>;
type UserMenuButtonProps = {
  onClick?: () => void;
  open?: boolean;
  displayName?: string;
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
      <strong css={{ paddingRight: `${15 / perRem}em` }}>
        {children || displayName}
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

export default UserMenuButton;
