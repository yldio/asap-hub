import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { rem, tabletScreen } from '../pixels';
import { MembersList, TabbedCard } from '../molecules';
import { getUniqueCommaStringWithSuffix } from '../utils/text';
import { fern } from '../colors';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  paddingTop: `${rem(32)}`,
  display: 'grid',
  rowGap: rem(24),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

const nameStyles = css({
  color: fern.rgb,
  fontWeight: 'normal',
});

const paragraphStyles = css({
  margin: 0,
  paddingBottom: `${rem(32)}`,
});

type TeamMembersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  readonly members: ReadonlyArray<TeamMember>;
  readonly isTeamInactive: boolean;
};

const TeamMembersTabbedCard: React.FC<TeamMembersTabbedCardProps> = ({
  title,
  description,
  members,
  isTeamInactive,
}) => {
  const alumniMembers = members.filter((member) => member.alumniSinceDate);
  const activeMembers = members.filter((member) => !member.alumniSinceDate);

  return (
    <TabbedCard
      title={title}
      description={description}
      activeTabIndex={isTeamInactive ? 1 : 0}
      tabs={[
        {
          tabTitle: `Active Team Members (${
            isTeamInactive ? 0 : activeMembers.length
          })`,
          items: isTeamInactive ? [] : activeMembers,
          truncateFrom: 8,
          disabled: isTeamInactive,
        },
        {
          tabTitle: `Past Team Members (${
            isTeamInactive ? members.length : alumniMembers.length
          })`,
          items: isTeamInactive ? members : alumniMembers,
          truncateFrom: 8,
          disabled: alumniMembers.length === 0,
        },
      ]}
      getShowMoreText={(showMore) =>
        `View ${showMore ? 'Less' : 'More'} Members`
      }
    >
      {({ data }) => (
        <div css={containerStyles}>
          {data.length > 0 ? (
            <MembersList
              members={data.map(
                ({
                  displayName,
                  role,
                  labs = [],
                  avatarUrl,
                  firstName,
                  lastName,
                  id,
                  alumniSinceDate,
                }) => ({
                  firstLine: displayName,
                  secondLine: role,
                  thirdLine: getUniqueCommaStringWithSuffix(
                    labs.map((lab) => lab.name),
                    'Lab',
                  ),
                  avatarUrl,
                  firstName,
                  lastName,
                  id,
                  alumniSinceDate,
                }),
              )}
              overrideNameStyles={nameStyles}
            />
          ) : (
            <p css={paragraphStyles}>{`There are no ${
              isTeamInactive ? 'past' : 'active'
            } team members.`}</p>
          )}
        </div>
      )}
    </TabbedCard>
  );
};

export default TeamMembersTabbedCard;
