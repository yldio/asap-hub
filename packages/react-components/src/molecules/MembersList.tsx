import { Fragment } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { perRem, tabletScreen } from '../pixels';
import { lead } from '../colors';
import { Link, Avatar, Anchor, Ellipsis } from '../atoms';
import { alumniBadgeIcon } from '../icons';
import { ImageLink } from '.';
import { styles } from '../atoms/Link';
import { hover } from './LinkHeadline';

const containerStyles = css({
  margin: 0,
  padding: 0,
  display: 'grid',

  gridTemplateColumns: `${48 / perRem}em 1fr`,
  gridColumnGap: `${18 / perRem}em`,
  gridAutoFlow: 'row dense',
});
const multiColumnContainerStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${48 / perRem}em 1fr ${48 / perRem}em 1fr`,
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
  lineHeight: `${8 / perRem}em`,
  marginLeft: `${8 / perRem}em`,
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
  minHeight: `${24 / perRem}em`,
});

const labStyles = css({
  padding: `0 0 ${24 / perRem}em`,
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
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  singleColumn = false,
  overrideNameStyles,
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
        const href = network({}).users({}).user({ userId: id }).$;
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
              <div css={avatarStyles}>
                <ImageLink link={href}>{userAvatar}</ImageLink>
              </div>
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
                  textStyles,
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
