import {
  colorWithTransparency,
  drawerQuery,
  navigationGrey,
  paper,
  steel,
  tin,
  UserMenuButton,
} from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { smallDesktopQuery } from '../layout';

import UserMenu from '../molecules/UserMenu';

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
const buttonTextStyles = css({
  whiteSpace: 'nowrap',
  [smallDesktopQuery]: {
    display: 'none',
  },
});

type UserNavigationProps = Omit<
  ComponentProps<typeof UserMenu>,
  'closeUserMenu'
>;

const UserNavigation: React.FC<UserNavigationProps> = (userNavigationProps) => {
  const [menuShown, setMenuShown] = useState(false);
  const { firstName, lastName, displayName, avatarUrl } =
    useCurrentUserGP2() || {};
  return (
    <div css={css({ position: 'relative' })}>
      <UserMenuButton
        onClick={() => setMenuShown(!menuShown)}
        open={menuShown}
        firstName={firstName}
        lastName={lastName}
        displayName={displayName}
        avatarUrl={avatarUrl}
      >
        <span css={buttonTextStyles}>{`Hi, ${
          firstName ?? 'Unknown User'
        }`}</span>
      </UserMenuButton>
      <div css={css([userMenuStyles, menuShown && userMenuShownStyles])}>
        <UserMenu {...userNavigationProps} closeUserMenu={setMenuShown} />
      </div>
    </div>
  );
};

export default UserNavigation;
