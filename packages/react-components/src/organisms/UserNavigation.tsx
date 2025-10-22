import { css } from '@emotion/react';
import { logout, staticPages } from '@asap-hub/routing';

import {
  rem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Divider, NavigationLink, Caption, Anchor } from '../atoms';
import { UserIcon, feedbackIcon, logoutIcon } from '../icons';
import { mailToFeedback } from '../mail';
import { UserNavigationAssociationSection } from '../molecules';

const containerStyles = css({
  minWidth: '312px',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${rem(9)} ${rem(12)} ${vminLinearCalc(
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

const dividerStyle = css({
  display: 'block',
  marginLeft: rem(12),
  marginRight: rem(12),
});

const bottomLinksStyles = css({
  flexGrow: 1,

  display: 'flex',
  alignItems: 'flex-end',
  padding: `${rem(12)} ${rem(12)} 0`,
});

export interface UserNavigationProps {
  readonly userOnboarded?: boolean;
  readonly userProfileHref: string;
  readonly teams: ReadonlyArray<{ name: string; href: string }>;
  readonly workingGroups: ReadonlyArray<{
    name: string;
    href: string;
    active: boolean;
  }>;
  readonly interestGroups: ReadonlyArray<{
    name: string;
    href: string;
    active: boolean;
  }>;
  readonly aboutHref: string;
}
const UserNavigation: React.FC<UserNavigationProps> = ({
  userOnboarded = true,
  userProfileHref,
  teams,
  workingGroups,
  interestGroups,
  aboutHref,
}) => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <NavigationLink href={userProfileHref} icon={<UserIcon />}>
          My Profile
        </NavigationLink>
      </li>
      <UserNavigationAssociationSection
        userOnboarded={userOnboarded}
        association={teams}
        title="MY TEAMS"
      />
      {interestGroups.length > 0 &&
        interestGroups.some((interestGroup) => interestGroup.active) && (
          <UserNavigationAssociationSection
            userOnboarded={userOnboarded}
            association={interestGroups}
            title="MY INTEREST GROUPS"
          />
        )}
      {workingGroups.length > 0 &&
        workingGroups.some((workingGroup) => workingGroup.active) && (
          <UserNavigationAssociationSection
            userOnboarded={userOnboarded}
            association={workingGroups}
            title="MY WORKING GROUPS"
          />
        )}
    </ul>
    <span css={dividerStyle}>
      <Divider />
    </span>
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
          Privacy Notice
        </Anchor>
        {'  ·  '}
        <Anchor href={aboutHref}>About ASAP</Anchor>
      </Caption>
    </div>
  </nav>
);

export default UserNavigation;
