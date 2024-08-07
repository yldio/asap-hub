import { UserResponse } from '@asap-hub/model';
import { UserProfileContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useContext } from 'react';
import { Avatar, Display, Link, TabLink, StateTag, CopyButton } from '../atoms';
import { paper, tin } from '../colors';
import { editIcon, uploadIcon, alumniBadgeIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { SocialIcons, TabNav, UserProfilePersonalText } from '../molecules';
import { Toast } from '../organisms';
import {
  largeDesktopScreen,
  mobileScreen,
  perRem,
  rem,
  tabletScreen,
  vminLinearCalc,
} from '../pixels';
import { formatDateToTimezone } from '../date';

const middleSizeQuery = '@media (min-width: 620px)';
const bigSizeQuery = `@media (min-width: ${tabletScreen.width}px)`;

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${12 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,

  display: 'grid',
  grid: `
    ".             edit-personal-info" ${24 / perRem}em
    "personal-info personal-info     " auto
    "contact       edit-contact-info " auto
    "social        social            " auto
    "tab-nav       tab-nav           " auto
      / 1fr ${36 / perRem}em
  `,
  gridColumnGap: `${12 / perRem}em`,

  [middleSizeQuery]: {
    grid: `
      ".             .             edit-personal-info" ${24 / perRem}em
      "personal-info personal-info personal-info     " auto
      "contact       social        edit-contact-info " auto
      "tab-nav       tab-nav       tab-nav           " auto
        / max-content 1fr ${36 / perRem}em
    `,
  },

  [bigSizeQuery]: {
    paddingTop: `${36 / perRem}em`,
    grid: `
      "edit-personal-info personal-info personal-info ."
      "edit-contact-info  contact       social        ."
      ".                  tab-nav       tab-nav       ."
        / ${36 / perRem}em max-content 1fr ${36 / perRem}em
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

const nameHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${6 / perRem}em`,
  [`@media (max-width: ${tabletScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: `${24 / perRem}em`,
  },
});

const editPersonalInfoStyles = css({
  gridArea: 'edit-personal-info',
  justifySelf: 'end',
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

  [middleSizeQuery]: {
    justifySelf: 'start',
    gridTemplateColumns: 'min-content min-content',
  },

  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  alignItems: 'start',
});
const contactNoEditStyles = css({
  gridColumnEnd: 'edit-contact-info',
  [middleSizeQuery]: {
    gridColumnEnd: 'contact',
  },
});

const socialIconStyles = css({
  gridArea: 'social',
});

const tabNavStyles = css({
  gridArea: 'tab-nav',
});
const avatarContainer = css({
  display: 'grid',
  width: 90,
  height: 90,
  paddingBottom: `${12 / perRem}em`,
});
const imageContainer = css({ gridRow: 1, gridColumn: 1 });
const editButtonContainer = css({
  gridRow: 1,
  gridColumn: 1,
  alignSelf: 'flex-end',
  justifySelf: 'flex-end',
});

type UserProfileHeaderProps = Pick<
  UserResponse,
  | 'id'
  | 'lastModifiedDate'
  | 'alumniSinceDate'
  | 'alumniLocation'
  | 'avatarUrl'
  | 'contactEmail'
  | 'email'
  | 'fullDisplayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'lastName'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'role'
  | 'social'
  | 'teams'
  | 'degree'
  | 'labs'
> & {
  readonly onImageSelect?: (file: File) => void;
  readonly avatarSaving?: boolean;

  readonly editPersonalInfoHref?: string;
  readonly editContactInfoHref?: string;
  readonly sharedOutputsCount?: number;
  readonly upcomingEventsCount?: number;
  readonly pastEventsCount?: number;
};

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  id,
  lastModifiedDate,
  alumniSinceDate,
  alumniLocation,
  fullDisplayName,
  country,
  stateOrProvince,
  city,
  institution,
  firstName,
  lastName,
  teams,
  jobTitle,
  avatarUrl,
  contactEmail,
  email,
  degree,
  onImageSelect,
  avatarSaving,
  labs,

  editPersonalInfoHref,
  editContactInfoHref,
  role,
  social,
  sharedOutputsCount,
  upcomingEventsCount,
  pastEventsCount,
}) => {
  const tabRoutes = network({}).users({}).user({ userId: id });
  const { isOwnProfile } = useContext(UserProfileContext);

  return (
    <>
      {alumniSinceDate && (
        <Toast accent="warning">
          This alumni might not have all content updated or available. This user
          became alumni on the{' '}
          <strong>
            {formatDateToTimezone(alumniSinceDate, 'do MMMM yyyy')}
          </strong>
          , their contact details were last updated on the{' '}
          <strong>
            {formatDateToTimezone(lastModifiedDate, 'do MMMM yyyy')}
          </strong>
          {alumniLocation && (
            <span>
              {' '}
              and their role is now at <strong>{alumniLocation}</strong>
            </span>
          )}
          .
        </Toast>
      )}
      <header css={[containerStyles]}>
        <section css={personalInfoStyles}>
          <div>
            <div css={nameHeaderStyles}>
              <div css={{ display: 'flex' }}>
                <Display styleAsHeading={2}>{fullDisplayName}</Display>
                {degree ? (
                  <Display styleAsHeading={2}>, {degree}</Display>
                ) : isOwnProfile ? (
                  <div css={{ color: tin.rgb }}>
                    <Display styleAsHeading={2}>, Degree</Display>
                  </div>
                ) : null}
              </div>
              {alumniSinceDate && (
                <StateTag icon={alumniBadgeIcon} label="Alumni" />
              )}
            </div>
            <UserProfilePersonalText
              institution={institution}
              country={country}
              stateOrProvince={stateOrProvince}
              city={city}
              jobTitle={jobTitle}
              teams={teams}
              labs={labs}
              userActiveTeamsRoute={tabRoutes.research({}).$}
            />
          </div>
          <div css={avatarContainer}>
            <div css={imageContainer}>
              <Avatar
                imageUrl={avatarUrl}
                firstName={firstName}
                lastName={lastName}
              />
            </div>
            {onImageSelect && (
              <div css={editButtonContainer}>
                <label>
                  <Link
                    buttonStyle
                    small
                    primary
                    href={undefined}
                    label="Edit Avatar"
                    enabled={!avatarSaving}
                  >
                    {uploadIcon}
                    <input
                      disabled={avatarSaving}
                      type="file"
                      accept="image/x-png,image/jpeg"
                      aria-label="Upload Avatar"
                      onChange={(event) =>
                        event.target.files?.length &&
                        event.target.files[0] &&
                        onImageSelect(event.target.files[0])
                      }
                      css={{ display: 'none' }}
                    />
                  </Link>
                </label>
              </div>
            )}
          </div>
        </section>
        {editPersonalInfoHref && (
          <div css={editPersonalInfoStyles}>
            <Link
              buttonStyle
              small
              primary
              href={editPersonalInfoHref}
              label="Edit personal information"
            >
              {editIcon}
            </Link>
          </div>
        )}
        <section
          css={[
            contactStyles,
            editContactInfoHref ? null : contactNoEditStyles,
          ]}
        >
          <Link
            small
            buttonStyle
            primary
            href={createMailTo(contactEmail || email)}
          >
            Contact
          </Link>
          <div
            css={{
              margin: `${rem(12)} ${rem(8)}`,
            }}
          >
            <CopyButton
              hoverTooltipText="Copy Email"
              clickTooltipText="Email Copied"
              onClick={() => navigator.clipboard.writeText(email)}
            />
          </div>
        </section>

        {editContactInfoHref && (
          <div css={editContactStyles}>
            <Link
              buttonStyle
              small
              primary
              href={editContactInfoHref}
              label="Edit contact information"
            >
              {editIcon}
            </Link>
          </div>
        )}
        <div css={[socialIconStyles]}>
          <SocialIcons {...social} />
        </div>
        <div css={tabNavStyles}>
          <TabNav>
            <TabLink href={tabRoutes.research({}).$}>Research</TabLink>
            <TabLink href={tabRoutes.about({}).$}>Background</TabLink>
            <TabLink href={tabRoutes.outputs({}).$}>
              Shared Outputs
              {sharedOutputsCount !== undefined && ` (${sharedOutputsCount})`}
            </TabLink>
            <TabLink href={tabRoutes.upcoming({}).$}>
              Upcoming Events
              {upcomingEventsCount !== undefined && ` (${upcomingEventsCount})`}
            </TabLink>

            <TabLink href={tabRoutes.past({}).$}>
              Past Events
              {pastEventsCount !== undefined && ` (${pastEventsCount})`}
            </TabLink>
          </TabNav>
        </div>
      </header>
    </>
  );
};

export default UserProfileHeader;
