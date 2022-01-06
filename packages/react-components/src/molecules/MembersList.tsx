import { css } from '@emotion/react';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { perRem, tabletScreen } from '../pixels';
import { lead } from '../colors';
import { Link, Avatar, Anchor, Ellipsis } from '../atoms';
import { getUniqueCommaStringWithSuffix } from '../utils';

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
  paddingTop: `${12 / perRem}em`,
});

const nameStyles = css({
  fontWeight: 'bold',
  paddingTop: `${12 / perRem}em`,
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
});

const labStyles = css({
  padding: `0 0 ${24 / perRem}em`,
});
const teamStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `0 0 ${24 / perRem}em`,
});

interface MembersListProps {
  readonly members: ReadonlyArray<
    {
      firstLine: string;
      secondLine: string;
      thirdLine: string | ReadonlyArray<Pick<UserTeam, 'id' | 'displayName'>>;
    } & Pick<UserResponse, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>
  >;
  singleColumn?: boolean;
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  singleColumn = false,
}) => (
  <ul css={[containerStyles, singleColumn || multiColumnContainerStyles]}>
    {members.map(({ id, firstLine, secondLine, thirdLine, ...member }) => {
      const href = network({}).users({}).user({ userId: id }).$;
      return (
        <li key={id} css={{ display: 'contents' }}>
          <Anchor href={href} css={{ display: 'contents' }}>
            <div css={avatarStyles}>
              <Avatar
                firstName={member.firstName}
                lastName={member.lastName}
                imageUrl={member.avatarUrl}
              />
            </div>
          </Anchor>
          <Anchor href={href} css={{ display: 'contents' }}>
            <div css={nameStyles}>{firstLine}</div>
          </Anchor>
          <Anchor href={href} css={{ display: 'contents' }}>
            <div
              css={[
                addToColumnStyles,
                singleColumn || multiColumnAddToColumnStyles,
                textStyles,
              ]}
            >
              {secondLine}
            </div>
          </Anchor>
          <Anchor href={href} css={{ display: 'contents' }}>
            <div
              css={[
                addToColumnStyles,
                singleColumn || multiColumnAddToColumnStyles,
                textStyles,
                labStyles,
              ]}
            >
              <Ellipsis>
                {thirdLine instanceof Array
                  ? thirdLine.map((team) => (
                      <li key={team.id}>
                        <Link
                          href={
                            network({}).teams({}).team({ teamId: team.id }).$
                          }
                        >
                          Team {team.displayName}
                        </Link>
                      </li>
                    ))
                  : thirdLine}
              </Ellipsis>
            </div>
          </Anchor>
        </li>
      );
    })}
  </ul>
);

export default MembersList;
