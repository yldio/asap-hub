import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Divider, NavigationLink, Caption, Link } from '../atoms';
import {
  teamIcon,
  userIcon,
  settingsIcon,
  feedbackIcon,
  logoutIcon,
} from '../icons';

const containerStyles = css({
  minWidth: '312px',
  boxSizing: 'border-box',
  padding: `0 ${12 / perRem}em`,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,

  boxSizing: 'border-box',
  padding: `${12 / perRem}em 0`,
});

const bottomLinksStyles = css({
  paddingBottom: vminLinearCalc(mobileScreen, 8, largeDesktopScreen, 12, 'px'),
  display: 'flex',
  justifyContent: 'center',
});

interface UserNavigationProps {
  readonly profileHref: string;
  readonly teams: ReadonlyArray<{ name: string; href: string }>;
  readonly settingsHref: string;
  readonly feedbackHref: string;
  readonly logoutHref: string;
  readonly termsHref: string;
  readonly privacyPolicyHref: string;
  readonly aboutHref: string;
}
const UserNavigation: React.FC<UserNavigationProps> = ({
  profileHref,
  teams,
  settingsHref,
  feedbackHref,
  logoutHref,
  termsHref,
  privacyPolicyHref,
  aboutHref,
}) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={profileHref} icon={userIcon}>
          My Profile
        </NavigationLink>
      </li>
      {teams.map(({ name, href }) => (
        <li key={href}>
          <NavigationLink href={href} icon={teamIcon}>
            My Team: {name}
          </NavigationLink>
        </li>
      ))}
    </ul>
    <Divider />
    <ul css={listStyles}>
      <li>
        <NavigationLink href={settingsHref} icon={settingsIcon}>
          Settings
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={feedbackHref} icon={feedbackIcon}>
          Give Feedback
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={logoutHref} icon={logoutIcon}>
          Log Out
        </NavigationLink>
      </li>
    </ul>
    <div css={bottomLinksStyles}>
      <Caption accent="lead" asParagraph>
        <Link theme={null} href={termsHref}>
          Terms of Use
        </Link>
        {'  ·  '}
        <Link theme={null} href={privacyPolicyHref}>
          Privacy Policy
        </Link>
        {'  ·  '}
        <Link theme={null} href={aboutHref}>
          About ASAP
        </Link>
      </Caption>
    </div>
  </nav>
);

export default UserNavigation;
