import React from 'react';
import css from '@emotion/css';
import { logout, staticPages } from '@asap-hub/routing';

import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Divider, NavigationLink, Caption, Anchor } from '../atoms';
import { teamIcon, userIcon, feedbackIcon, logoutIcon } from '../icons';
import { mailToFeedback } from '../mail';

const containerStyles = css({
  minWidth: '312px',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${12 / perRem}em ${12 / perRem}em ${vminLinearCalc(
    mobileScreen,
    8,
    largeDesktopScreen,
    12,
    'px',
  )}`,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const bottomLinksStyles = css({
  flexGrow: 1,

  display: 'flex',
  alignItems: 'flex-end',
  padding: `${12 / perRem}em ${12 / perRem}em 0`,
});

export interface UserNavigationProps {
  readonly userProfileHref: string;
  readonly teams: ReadonlyArray<{ name: string; href: string }>;
  readonly aboutHref: string;
}
const UserNavigation: React.FC<UserNavigationProps> = ({
  userProfileHref,
  teams,
  aboutHref,
}) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={userProfileHref} icon={userIcon}>
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
      {/* settings could go here */}
      <li>
        <NavigationLink href={mailToFeedback()} icon={feedbackIcon}>
          Give Feedback
        </NavigationLink>
      </li>
      <li>
        <NavigationLink href={logout({}).$} icon={logoutIcon}>
          Log Out
        </NavigationLink>
      </li>
    </ul>
    <div css={bottomLinksStyles}>
      <Caption accent="lead" asParagraph>
        <Anchor href={staticPages({}).terms({}).$}>Terms of Use</Anchor>
        {'  ·  '}
        <Anchor href={staticPages({}).privacyPolicy({}).$}>
          Privacy Policy
        </Anchor>
        {'  ·  '}
        <Anchor href={aboutHref}>About ASAP</Anchor>
      </Caption>
    </div>
  </nav>
);

export default UserNavigation;
