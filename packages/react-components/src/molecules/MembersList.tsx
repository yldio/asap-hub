import { Fragment } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { rem, tabletScreen } from '../pixels';
import { lead } from '../colors';
import { Link, Avatar, Anchor, Ellipsis } from '../atoms';
import { alumniBadgeIcon } from '../icons';
import { hoverStyle } from './ImageLink';
import { styles } from '../atoms/Link';
import { hover } from './LinkHeadline';

const containerStyles = css({
  margin: 0,
  padding: 0,
  display: 'grid',

  gridTemplateColumns: `${rem(48)} 1fr`,
  gridColumnGap: rem(18),
  gridAutoFlow: 'row dense',
});
const multiColumnContainerStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${rem(48)} 1fr ${rem(48)} 1fr`,
  },
});

const avatarStyles = css({
  gridRowEnd: 'span 3',
});

const nameStyles = css({
  fontWeight: 'bold',
  display: 'inline-flex',
});

const badgeStyles = css({
  lineHeight: rem(8),
  marginLeft: rem(8),
});

const addToColumnStyles = css({
  gridColumn: 2,
});
const multiColumnAddToColumnStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    'li:nth-of-type(2n) &': {
      gridColumn: 4,
    },
  },
});
const textStyles = css({
  color: lead.rgb,
  minHeight: rem(24),
});

const labStyles = css({
  padding: `0 0 ${rem(24)}`,
});

interface MembersListProps {
  readonly members: ReadonlyArray<
    {
      firstLine: string;
      secondLine?: string;
      thirdLine?: string | ReadonlyArray<Pick<UserTeam, 'id' | 'displayName'>>;
    } & Pick<UserResponse, 'id'> &
      Partial<
        Pick<
          UserResponse,
          'firstName' | 'lastName' | 'avatarUrl' | 'alumniSinceDate'
        >
      >
  >;
  singleColumn?: boolean;
  readonly overrideNameStyles?: SerializedStyles;
  readonly userRoute?: ({ userId }: { userId: string }) => {
    $: string;
  };
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  singleColumn = false,
  overrideNameStyles,
  userRoute = network({}).users({}).user,
}) => (
  <ul css={[containerStyles, singleColumn || multiColumnContainerStyles]}>
    {members.map(
      ({
        id,
        firstLine,
        secondLine,
        thirdLine,
        alumniSinceDate,
        ...member
      }) => {
        const href = userRoute({ userId: id }).$;
        const userAvatar = (
          <Avatar
            firstName={member.firstName}
            lastName={member.lastName}
            imageUrl={member.avatarUrl}
          />
        );
        return (
          <li key={id} css={{ display: 'contents' }}>
            <Anchor href={href} css={{ display: 'contents' }}>
              <div css={[avatarStyles, hoverStyle]}>{userAvatar}</div>
            </Anchor>
            <Anchor
              href={href}
              css={({ colors }) => [
                styles,
                hover(colors),
                nameStyles,
                overrideNameStyles,
              ]}
            >
              {firstLine}
              {alumniSinceDate && (
                <span css={badgeStyles}>{alumniBadgeIcon}</span>
              )}
            </Anchor>
            <Anchor href={href} css={{ display: 'contents' }}>
              <div
                css={[
                  addToColumnStyles,
                  singleColumn || multiColumnAddToColumnStyles,
                  secondLine && textStyles,
                ]}
              >
                <Ellipsis>{secondLine}</Ellipsis>
              </div>
            </Anchor>
            <div
              css={[
                addToColumnStyles,
                singleColumn || multiColumnAddToColumnStyles,
                textStyles,
                labStyles,
              ]}
            >
              <Ellipsis>
                {thirdLine instanceof Array ? (
                  thirdLine.map((team) => (
                    <Fragment key={team.id}>
                      <Link
                        href={network({}).teams({}).team({ teamId: team.id }).$}
                      >
                        Team {team.displayName}
                      </Link>{' '}
                    </Fragment>
                  ))
                ) : (
                  <Anchor href={href} css={{ display: 'contents' }}>
                    {thirdLine}
                  </Anchor>
                )}
              </Ellipsis>
            </div>
          </li>
        );
      },
    )}
  </ul>
);

export default MembersList;
