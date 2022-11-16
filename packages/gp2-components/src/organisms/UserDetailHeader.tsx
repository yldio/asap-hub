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
  columnGap: rem(32),
  rowGap: rem(12),
  [nonMobileQuery]: {
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
const buttonStyles = css({
  [mobileQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
    a: { minWidth: '100%' },
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
        <Avatar
          imageUrl={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          overrideStyles={avatarStyles}
        />

        <div css={textContainerStyles}>
          <div css={[rowStyles, buttonStyles]}>
            <Headline3 noMargin>
              {displayName}
              {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
            </Headline3>
            {edit && (
              <div css={editButtonStyles}>
                <Link href={edit} buttonStyle noMargin small>
                  Required {addIcon}
                </Link>
              </div>
            )}
          </div>
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
