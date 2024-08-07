import { InterestGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Paragraph } from '../atoms';
import { charcoal, steel } from '../colors';
import { TeamIcon } from '../icons';
import { LinkHeadline, TabbedCard } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';

const itemsListWrapper = css({
  listStyle: 'none',
  margin: 0,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

const listStyles = css({
  padding: 0,
  margin: 0,
  listStyleType: 'none',
});

const listElementStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: `${24 / perRem}em`,
  paddingTop: `${28 / perRem}em`,
  paddingBottom: `${28 / perRem}em`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':last-child': {
    borderBottom: 'none',
  },
});

const teamsStyles = css({
  color: charcoal.rgb,
  display: 'flex',
  alignItems: 'center',
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

type TeamGroupsTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title'
> & {
  interestGroups: InterestGroupResponse[];
  isTeamInactive: boolean;
};

const TeamInterestGroupsTabbedCard: React.FC<TeamGroupsTabbedCardProps> = ({
  title,
  interestGroups,
  isTeamInactive,
}) => {
  const [activeInterestGroups, inactiveInterestGroups] = splitListBy(
    interestGroups,
    (interestGroup) => isTeamInactive || !!interestGroup?.active,
  );

  return (
    <TabbedCard
      title={title}
      activeTabIndex={isTeamInactive ? 1 : 0}
      getShowMoreText={(showMore) =>
        `View ${showMore ? 'Less' : 'More'} Groups`
      }
      tabs={[
        {
          tabTitle: `Active Memberships (${
            isTeamInactive ? 0 : activeInterestGroups.length
          })`,
          items: activeInterestGroups,
          truncateFrom: 2,
          disabled: isTeamInactive,
          empty: (
            <Paragraph accent="lead">
              There are no active memberships.
            </Paragraph>
          ),
        },
        {
          tabTitle: `Past Memberships (${
            isTeamInactive
              ? interestGroups.length
              : inactiveInterestGroups.length
          })`,
          items: isTeamInactive ? interestGroups : inactiveInterestGroups,
          truncateFrom: 2,
          disabled: inactiveInterestGroups.length === 0,
          empty: (
            <Paragraph accent="lead">There are no past memberships.</Paragraph>
          ),
        },
      ]}
    >
      {({ data }) => (
        <div css={itemsListWrapper}>
          <ul css={listStyles}>
            {data.map(({ id, teams, description, name }, index) => (
              <li css={listElementStyles} key={`team-group-${index}`}>
                <LinkHeadline
                  href={
                    network({})
                      .interestGroups({})
                      .interestGroup({ interestGroupId: id }).$
                  }
                  level={4}
                  noMargin={true}
                >
                  {name}
                </LinkHeadline>
                <Paragraph noMargin accent="lead">
                  {description}
                </Paragraph>
                <span css={teamsStyles}>
                  <span css={iconStyles}>
                    <TeamIcon />{' '}
                  </span>
                  {teams.length} Team{teams.length !== 1 ? 's' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </TabbedCard>
  );
};

export default TeamInterestGroupsTabbedCard;
