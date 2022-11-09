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
import { useState } from 'react';
import { smallDesktopQuery } from '../layout';

import UserMenu from '../molecules/UserMenu';

const userMenuStyles = css({
  backgroundColor: paper.rgb,
  display: 'none',
  position: 'absolute',
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,
});
const userMenuShownStyles = css({
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

const UserNavigation: React.FC = () => {
  const [menuShown, setMenuShown] = useState(false);
  const { firstName, lastName, displayName, avatarUrl } =
    useCurrentUserGP2() || {};
  return (
    <div>
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
        <UserMenu />
      </div>
    </div>
  );
};

export default UserNavigation;
