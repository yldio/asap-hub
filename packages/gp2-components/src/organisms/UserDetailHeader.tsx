import { gp2 as gp2Model } from '@asap-hub/model';
import { Avatar, BackLink, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { usersHeaderImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';

const { rem, tabletScreen } = pixels;

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
> & {
  backHref: string;
};

const avatarSize = 132;

const containerStyles = css({
  display: 'grid',
  columnGap: rem(32),
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
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

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  displayName,
  avatarUrl,
  degrees,
  firstName,
  lastName,
  backHref,
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
          <div>
            <h3 css={titleStyles}>
              {displayName}
              {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
            </h3>
          </div>
        </div>
      </div>
    </CardWithBackground>
  </header>
);
export default UserDetailHeader;
