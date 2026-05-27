import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps, useMemo } from 'react';
import { rem, tabletScreen } from '../pixels';
import { LabsList, MembersList, RolesList, TabbedCard } from '../molecules';
import { fern } from '../colors';
import {
  groupTeamMembersByUserId,
  GroupedTeamMember,
  splitListBy,
} from '../utils';
import { Paragraph } from '../atoms';

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
  const grouped = useMemo(
    () => groupTeamMembersByUserId([...members]),
    [members],
  );

  const [pastMembers, activeMembers] = splitListBy(
    grouped,
    (member) =>
      isTeamInactive ||
      !!member?.alumniSinceDate ||
      !!member?.inactiveSinceDate,
  );

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
          empty: (
            <Paragraph accent="lead">
              There are no active team members.
            </Paragraph>
          ),
        },
        {
          tabTitle: `Past Team Members (${
            isTeamInactive ? grouped.length : pastMembers.length
          })`,
          items: isTeamInactive ? grouped : pastMembers,
          truncateFrom: 8,
          disabled: pastMembers.length === 0,
          empty: (
            <Paragraph accent="lead">There are no past team members.</Paragraph>
          ),
        },
      ]}
      getShowMoreText={(showMore) =>
        `View ${showMore ? 'Less' : 'More'} Members`
      }
    >
      {({ data }: { data: GroupedTeamMember[] }) => (
        <div css={containerStyles}>
          <MembersList
            members={data.map(
              ({
                displayName,
                roles,
                labs = [],
                avatarUrl,
                firstName,
                lastName,
                id,
                alumniSinceDate,
              }) => ({
                firstLine: displayName,
                secondLine: <RolesList roles={roles} maxVisible={2} />,
                thirdLine:
                  labs.length > 0 ? (
                    <LabsList labs={labs} maxVisible={2} />
                  ) : undefined,
                avatarUrl,
                firstName,
                lastName,
                id,
                alumniSinceDate,
              }),
            )}
            overrideNameStyles={nameStyles}
          />
        </div>
      )}
    </TabbedCard>
  );
};

export default TeamMembersTabbedCard;
