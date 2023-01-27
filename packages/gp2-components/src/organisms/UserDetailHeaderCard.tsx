import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Avatar,
  Headline3,
  Link,
  pixels,
  uploadIcon,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { addIcon, editIcon, locationIcon, roleIcon } from '../icons';
import { usersHeaderImage } from '../images';
import { mobileQuery, nonMobileQuery } from '../layout';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';
import UserRegion from '../molecules/UserRegion';
import colors from '../templates/colors';

const { rem } = pixels;

type UserDetailHeaderCardProps = Pick<
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
  editHref?: string;
  readonly onImageSelect?: (file: File) => void;
  readonly avatarSaving?: boolean;
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
  margin: 0,
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

const validateCompleted = ({
  firstName,
  lastName,
  degrees,
  region,
  country,
  positions,
  role,
}: Pick<
  UserDetailHeaderCardProps,
  | 'firstName'
  | 'lastName'
  | 'degrees'
  | 'region'
  | 'role'
  | 'country'
  | 'positions'
>) =>
  firstName &&
  lastName &&
  degrees?.length &&
  region &&
  country &&
  positions.length &&
  role;

const UserDetailHeaderCard: React.FC<UserDetailHeaderCardProps> = ({
  displayName,
  avatarUrl,
  degrees,
  firstName,
  lastName,
  region,
  role,
  city,
  country,
  positions,
  editHref,
  onImageSelect,
  avatarSaving = false,
}) => (
  <CardWithBackground image={usersHeaderImage}>
    <div css={containerStyles}>
      <div
        css={css({
          gridArea: 'avatar',
          display: 'grid',
          width: rem(avatarSize),
          height: rem(avatarSize),
        })}
      >
        <div css={css({ gridRow: 1, gridColumn: 1 })}>
          <Avatar
            imageUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            overrideStyles={avatarStyles}
          />
        </div>
        <div
          css={css({
            gridRow: 1,
            gridColumn: 1,
            alignSelf: 'flex-end',
            justifySelf: 'flex-end',
          })}
        >
          {onImageSelect && (
            <label>
              <Link
                small
                buttonStyle
                noMargin
                href={undefined}
                label="Edit Avatar"
                enabled={!avatarSaving}
              >
                <span
                  css={css({
                    display: 'flex',
                    margin: `${rem(3)} 0`,
                    svg: {
                      stroke: colors.neutral900.rgb,
                    },
                  })}
                >
                  {uploadIcon}
                </span>
                <input
                  disabled={avatarSaving}
                  type="file"
                  accept="image/x-png,image/jpeg"
                  aria-label="Upload Avatar"
                  onChange={(event) =>
                    event.target.files?.length &&
                    onImageSelect(event.target.files[0])
                  }
                  css={{ display: 'none' }}
                />
              </Link>
            </label>
          )}
        </div>
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
            <div css={rowContainerStyles} key={`position-${idx}`}>
              {positionRole} in {department} at {institution}
            </div>
          ),
        )}
      </div>
      {editHref && (
        <div css={[{ gridArea: 'edit' }, editButtonStyles]}>
          <Link
            href={editHref}
            buttonStyle
            noMargin
            small
            fullWidth
            overrideStyles={css({ padding: `${rem(5)} ${rem(14)}` })}
          >
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                gap: rem(8),
              }}
            >
              {validateCompleted({
                degrees,
                firstName,
                lastName,
                region,
                role,
                country,
                positions,
              })
                ? 'Edit'
                : 'Required'}
              {validateCompleted({
                degrees,
                firstName,
                lastName,
                region,
                role,
                country,
                positions,
              })
                ? editIcon
                : addIcon}
            </div>
          </Link>
        </div>
      )}
    </div>
  </CardWithBackground>
);
export default UserDetailHeaderCard;
