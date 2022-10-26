import { network } from '@asap-hub/routing';
import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Avatar, Anchor, Ellipsis } from '../atoms';
import { styles } from '../atoms/Link';
import { TabbedCard, ImageLink } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';
import { fern, lead } from '../colors';
import { alumniBadge } from '../icons';
import { getUniqueCommaStringWithSuffix } from '../utils/text';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(32)} 0`,
  display: 'grid',
  rowGap: rem(24),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    columnGap: rem(15),
  },
});

const listItemStyle = css({
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${15 / perRem}em`,
});

const avatarStyles = css({
  gridRowEnd: 'span 3',
  width: `${48 / perRem}em`,
  height: `${48 / perRem}em`,
});

const memberInfoContainerStyles = css({
  marginLeft: `${16 / perRem}em`,
});

const nameStyles = css({
  color: fern.rgb,
  display: 'inline-flex',
});

const badgeStyles = css({
  lineHeight: `${8 / perRem}em`,
  marginLeft: `${8 / perRem}em`,
});

const textStyles = css({
  color: lead.rgb,
  minHeight: `${24 / perRem}em`,
});

type TeamMembersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  readonly members: ReadonlyArray<TeamMember>;
};

const TeamMembersTabbedCard: React.FC<TeamMembersTabbedCardProps> = ({
  title,
  description,
  members,
}) => (
  <TabbedCard
    title={title}
    description={description}
    activeTabIndex={1}
    tabs={[
      {
        tabTitle: 'Active Team Members (0)',
        items: [],
        truncateFrom: 8,
        disabled: true,
      },
      {
        tabTitle: `Past Team Members (${members.length})`,
        items: members,
        truncateFrom: 8,
        disabled: false,
      },
    ]}
    getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Members`}
  >
    {({ data }) => (
      <ul css={containerStyles}>
        {data.map(
          ({
            id,
            displayName,
            firstName,
            lastName,
            avatarUrl,
            role,
            labs,
            alumniSinceDate,
          }) => {
            const href = network({}).users({}).user({ userId: id }).$;
            const userAvatar = (
              <Avatar
                firstName={firstName}
                lastName={lastName}
                imageUrl={avatarUrl}
              />
            );

            return (
              <li key={`member-${id}`} css={listItemStyle}>
                <Anchor href={href} css={{ display: 'contents' }}>
                  <div css={avatarStyles}>
                    <ImageLink link={href}>{userAvatar}</ImageLink>
                  </div>
                </Anchor>
                <div css={memberInfoContainerStyles}>
                  <Anchor href={href} css={[styles, nameStyles]}>
                    {displayName}
                    {alumniSinceDate && (
                      <span css={badgeStyles}>{alumniBadge}</span>
                    )}
                  </Anchor>
                  <Anchor href={href} css={{ display: 'contents' }}>
                    <div css={textStyles}>
                      <Ellipsis>{role}</Ellipsis>
                    </div>
                  </Anchor>
                  <Anchor href={href} css={{ display: 'contents' }}>
                    <div css={textStyles}>
                      <Ellipsis>
                        {labs &&
                          getUniqueCommaStringWithSuffix(
                            labs.map((lab) => lab.name),
                            'Lab',
                          )}
                      </Ellipsis>
                    </div>
                  </Anchor>
                </div>
              </li>
            );
          },
        )}
      </ul>
    )}
  </TabbedCard>
);

export default TeamMembersTabbedCard;
