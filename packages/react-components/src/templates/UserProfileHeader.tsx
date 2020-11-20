import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';

import {
  tabletScreen,
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Avatar, Paragraph, TabLink, Display, Link } from '../atoms';
import { UserProfilePersonalText, TabNav } from '../molecules';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { paper } from '../colors';
import { editIcon } from '../icons';

const containerStyles = css({
  alignSelf: 'stretch',
  backgroundColor: paper.rgb,
  padding: `${12 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,

  display: 'grid',
  grid: `
    ".             edit-personal-info" ${24 / perRem}em
    "personal-info personal-info     " auto
    "contact       edit-contact-info " auto
    "tab-nav       tab-nav           " auto
      / auto ${36 / perRem}em
  `,
  gridColumnGap: `${12 / perRem}em`,

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    paddingTop: `${36 / perRem}em`,
    grid: `
      "edit-personal-info personal-info ."
      "edit-contact-info  contact       ."
      ".                  tab-nav       ."
        / ${36 / perRem}em auto ${36 / perRem}em
    `,
    gridColumnGap: vminLinearCalc(
      mobileScreen,
      24,
      largeDesktopScreen,
      30,
      'px',
    ),
  },
});

const editPersonalInfoStyles = css({
  gridArea: 'edit-personal-info',
  justifySelf: 'end',
});

const staffContainerStyles = css({
  paddingBottom: `${36 / perRem}em`,
});

const personalInfoStyles = css({
  gridArea: 'personal-info',

  display: 'flex',
  flexDirection: 'column-reverse',

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    // only on big grid to avoid potential Avatar <=> Edit Button overlap
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
  },

  justifyContent: 'space-between',
  alignItems: 'start',
});

const editContactStyles = css({
  gridArea: 'edit-contact-info',
});
const contactStyles = css({
  gridArea: 'contact',

  display: 'flex',
  flexWrap: 'wrap',
});
const contactNoEditStyles = css({
  gridColumnEnd: 'edit-contact-info',
});
const contactButtonStyles = css({
  flexGrow: 1,
  alignSelf: 'center',

  display: 'flex',
  flexDirection: 'column',
});
const lastModifiedStyles = css({
  flexBasis: 0,
  flexGrow: 9999,

  textAlign: 'right',
  alignSelf: 'flex-end',

  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

const tabNavStyles = css({
  gridArea: 'tab-nav',
});

type UserProfileHeaderProps = Pick<
  UserResponse,
  | 'avatarUrl'
  | 'contactEmail'
  | 'department'
  | 'email'
  | 'displayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'lastModifiedDate'
  | 'lastName'
  | 'location'
  | 'role'
> & {
  readonly aboutHref: string;
  readonly researchHref: string;
  readonly outputsHref: string;
  readonly discoverHref: string;

  readonly editPersonalInfoHref?: string;
  readonly editContactInfoHref?: string;

  readonly teams: ReadonlyArray<UserTeam & { href: string }>;
};

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  department,
  displayName,
  institution,
  lastModifiedDate,
  firstName,
  lastName,
  location,
  teams,
  jobTitle,
  avatarUrl,
  contactEmail,
  email,

  aboutHref,
  researchHref,
  outputsHref,

  editPersonalInfoHref,
  editContactInfoHref,
  discoverHref,
  role,
}) => {
  const { isEnabled } = useFlags();

  return (
    <header css={[containerStyles, role === 'Staff' && staffContainerStyles]}>
      <section css={personalInfoStyles}>
        <div>
          <Display styleAsHeading={2}>{displayName}</Display>
          <UserProfilePersonalText
            department={department}
            institution={institution}
            location={location}
            jobTitle={jobTitle}
            teams={teams}
            role={role}
            discoverHref={discoverHref}
          />
        </div>
        <Avatar
          imageUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
        />
      </section>
      {editPersonalInfoHref && (
        <div css={editPersonalInfoStyles}>
          <Link
            buttonStyle
            small
            primary
            href={editPersonalInfoHref}
            label="Edit personal information"
            enabled={isEnabled('PROFILE_EDITING')}
          >
            {editIcon}
          </Link>
        </div>
      )}
      <section
        css={[contactStyles, editContactInfoHref ? null : contactNoEditStyles]}
      >
        {role !== 'Staff' ? (
          <div css={contactButtonStyles}>
            <Link
              small
              buttonStyle
              primary
              href={createMailTo(contactEmail || email)}
            >
              Contact
            </Link>
          </div>
        ) : null}
        {lastModifiedDate && (
          <div css={lastModifiedStyles}>
            <Paragraph accent="lead">
              <small>
                Last updated:{' '}
                {formatDistance(new Date(), new Date(lastModifiedDate))} ago
              </small>
            </Paragraph>
          </div>
        )}
      </section>
      {editContactInfoHref && (
        <div css={editContactStyles}>
          <Link
            buttonStyle
            small
            primary
            href={editContactInfoHref}
            label="Edit contact information"
            enabled={isEnabled('PROFILE_EDITING')}
          >
            {editIcon}
          </Link>
        </div>
      )}
      <div css={tabNavStyles}>
        {role !== 'Staff' ? (
          <TabNav>
            <TabLink href={researchHref}>Research</TabLink>
            <TabLink href={aboutHref}>Background</TabLink>
            <TabLink href={outputsHref}>Shared Outputs</TabLink>
          </TabNav>
        ) : null}
      </div>
    </header>
  );
};

export default UserProfileHeader;
