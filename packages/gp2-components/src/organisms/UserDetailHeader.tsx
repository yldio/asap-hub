import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Avatar,
  BackLink,
  crossQuery,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import locationIcon from '../icons/location-icon';
import roleIcon from '../icons/role-icon';
import { usersHeaderImage } from '../images';
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
  backHref: string;
};

const avatarSize = 132;

const containerStyles = css({
  display: 'grid',
  columnGap: rem(32),
  rowGap: rem(12),
  [crossQuery]: {
    gridTemplateColumns: `${rem(avatarSize)} auto`,
  },
});

const textContainerStyles = css({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'start',
  flexDirection: 'column',
});

const titleStyles = css({
  margin: `8px 0`,
  fontWeight: 'bold',
  fontSize: '26px',
  lineHeight: '32px',
});

const avatarStyles = css({
  margin: 'auto',
  width: rem(avatarSize),
  height: rem(avatarSize),
});
const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});
const rowContainerStyles = css({
  marginBottom: rem(12),
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
}) => (
  <header>
    <BackLink href={backHref} />
    <CardWithBackground image={usersHeaderImage}>
      <div css={containerStyles}>
        <Avatar
          imageUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          overrideStyles={avatarStyles}
        />

        <div css={textContainerStyles}>
          <h3 css={titleStyles}>
            {displayName}
            {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
          </h3>
          <div css={rowContainerStyles}>
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
        </div>
      </div>
    </CardWithBackground>
  </header>
);
export default UserDetailHeader;
