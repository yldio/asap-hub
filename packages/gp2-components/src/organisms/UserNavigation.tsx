import {
  Avatar,
  chevronDownIcon,
  chevronUpIcon,
  colorWithTransparency,
  drawerQuery,
  navigationGrey,
  paper,
  steel,
  tin,
  pixels,
} from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ComponentProps, useEffect, useRef, useState } from 'react';

import UserMenu from '../molecules/UserMenu';

const { rem } = pixels;

const buttonResetStyles = css({
  width: rem(80),
  padding: 0,
  backgroundColor: 'unset',
  border: 'none',
  outline: 'none',
});
const styles = css({
  padding: `${rem(12)} 0`,
  cursor: 'pointer',
  display: 'grid',
  alignItems: 'center',
});

const userMenuStyles = css({
  backgroundColor: paper.rgb,
  display: 'none',
  position: 'absolute',
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,
  right: 5,
});

const userMenuShownStyles = css({
  zIndex: 1,
  [drawerQuery]: {
    backgroundColor: navigationGrey.rgb,
  },
  display: 'unset',
});

type UserNavigationProps = Omit<
  ComponentProps<typeof UserMenu>,
  'closeUserMenu'
>;

const UserNavigation: React.FC<UserNavigationProps> = (userNavigationProps) => {
  const reference = useRef<HTMLDivElement>(null);
  const [menuShown, setMenuShown] = useState(false);
  const { firstName, lastName, avatarUrl } = useCurrentUserGP2() || {};

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        setMenuShown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setMenuShown, reference]);
  return (
    <div css={css({ position: 'relative' })} ref={reference}>
      <button
        aria-label="Toggle User Menu"
        css={[buttonResetStyles, styles]}
        onClick={(event) => {
          setMenuShown(!menuShown);
          event.preventDefault();
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: rem(16),
          }}
        >
          <Avatar
            imageUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
          />
          <span>{menuShown ? chevronUpIcon : chevronDownIcon}</span>
        </div>
      </button>
      <div css={css([userMenuStyles, menuShown && userMenuShownStyles])}>
        <UserMenu {...userNavigationProps} closeUserMenu={setMenuShown} />
      </div>
    </div>
  );
};

export default UserNavigation;
