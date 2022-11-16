import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Avatar,
  BackLink,
  Headline3,
  Link,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { addIcon } from '../icons';
import locationIcon from '../icons/location-icon';
import roleIcon from '../icons/role-icon';
import { usersHeaderImage } from '../images';
import { nonMobileQuery, mobileQuery } from '../layout';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';
import UserRegion from '../molecules/UserRegion';

const { rem } = pixels;

type UserDetailHeaderProps = Pick<
  gp2Model.UserResponse,
  | 'id'
  | 'displayName'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'degrees'
  | 'region'
  | 'role'
  | 'city'
  | 'country'
  | 'positions'
> & {
  edit?: string;
  backHref?: string;
};

const avatarSize = 132;

const containerStyles = css({
  display: 'grid',
  grid: `
    "avatar headline edit" max-content
    "avatar details details" auto
    /min-content auto min-content
    `,
  columnGap: rem(32),
  rowGap: rem(12),
  [mobileQuery]: {
    grid: `
    "edit" auto
    "avatar" ${rem(avatarSize)}
    "headline" auto
    "details" auto`,
  },
});

const avatarStyles = css({
  width: rem(avatarSize),
  height: rem(avatarSize),
  [mobileQuery]: {
    margin: 'auto',
  },
});
const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [nonMobileQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});
const rowContainerStyles = css({
  marginBottom: rem(12),
});
const editButtonStyles = css({
  [nonMobileQuery]: {
    marginLeft: 'auto',
  },
});

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  displayName,
  avatarUrl,
  degrees,
  firstName,
  lastName,
  backHref,
  region,
  role,
  city,
  country,
  positions,
  edit,
}) => (
  <header>
    {backHref && <BackLink href={backHref} />}
    <CardWithBackground image={usersHeaderImage}>
      <div css={containerStyles}>
        <div css={css({ gridArea: 'avatar' })}>
          <Avatar
            imageUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            overrideStyles={avatarStyles}
          />
        </div>

        <div css={[rowStyles, { gridArea: 'headline' }]}>
          <Headline3 noMargin>
            {displayName}
            {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
          </Headline3>
        </div>
        <div css={[rowContainerStyles, { gridArea: 'details' }]}>
          <div css={rowStyles}>
            <IconWithLabel icon={roleIcon}>{role}</IconWithLabel>
            <UserRegion region={region} />
          </div>
          <div css={rowContainerStyles}>
            <IconWithLabel icon={locationIcon}>
              <span>
                {city && `${city}, `}
                {country}
              </span>
            </IconWithLabel>
          </div>
          {positions.map(
            ({ role: positionRole, department, institution }, idx) => (
              <div css={rowContainerStyles} key={idx}>
                {positionRole} in {department} at {institution}
              </div>
            ),
          )}
        </div>
        {edit && (
          <div css={[{ gridArea: 'edit' }, editButtonStyles]}>
            <Link href={edit} buttonStyle noMargin small tabletFullWidth>
              Required {addIcon}
            </Link>
          </div>
        )}
      </div>
    </CardWithBackground>
  </header>
);
export default UserDetailHeader;
