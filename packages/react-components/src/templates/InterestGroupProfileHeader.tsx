import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import formatDistance from 'date-fns/formatDistance';
import { network } from '@asap-hub/routing';

import { paper, lead, steel } from '../colors';
import { perRem, tabletScreen } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { Display, Link, StateTag, TabLink } from '../atoms';
import { inactiveBadgeIcon, TeamIcon } from '../icons';
import { TabNav } from '../molecules';
import { EventSearch } from '../organisms';
import { queryParamString } from '../routing';

const visualHeaderStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const belowHeadlineStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  // All children must have at least +12 padding-top to avoid box breakout.
  // Why not just subtract it from the children then? For the wrapping case.
  // Hooray for no row-gap support in Safari.
  marginTop: `${-12 / perRem}em`,
});

const controlsStyles = css({
  padding: `0 ${contentSidePaddingWithNavigation(10)}`,
});
const titleStyle = css({
  display: 'flex',
  flexFlow: 'row',
  gap: `${15 / perRem}em`,
  alignItems: 'center',
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    flexFlow: 'column',
    gap: 3,
    alignItems: 'flex-start',
    paddingBottom: `${12 / perRem}em`,
  },
});

type InterestGroupProfileHeaderProps = {
  readonly id: string;
  readonly name: string;
  readonly numberOfTeams: number;
  readonly lastModifiedDate: string;
  readonly groupTeamsHref: string;
  readonly active: boolean;
  readonly upcomingEventsCount: number;
  readonly pastEventsCount: number;
} & ComponentProps<typeof EventSearch>;
const InterestGroupProfileHeader: React.FC<InterestGroupProfileHeaderProps> = ({
  id,
  active,
  name,
  numberOfTeams,
  lastModifiedDate,
  groupTeamsHref,
  searchQuery,
  onChangeSearchQuery,
  upcomingEventsCount,
  pastEventsCount,
}) => {
  const route = network({})
    .interestGroups({})
    .interestGroup({ interestGroupId: id });

  return (
    <header>
      <div css={visualHeaderStyles}>
        <div css={titleStyle}>
          <Display styleAsHeading={2}>{name}</Display>
          {!active && <StateTag icon={inactiveBadgeIcon} label="Inactive" />}
        </div>

        <div
          css={[belowHeadlineStyles, !active && { flexFlow: 'row-reverse' }]}
        >
          {active && (
            <>
              <div
                css={{
                  paddingRight: `${15 / perRem}em`,
                  paddingTop: `${24 / perRem}em`,
                  display: 'grid',
                }}
              >
                <TeamIcon />
              </div>
              <div
                css={{
                  flexGrow: 1,
                  paddingRight: `${30 / perRem}em`,
                  paddingTop: `${24 / perRem}em`,
                }}
              >
                <Link href={groupTeamsHref}>
                  {numberOfTeams} Team{numberOfTeams === 1 ? '' : 's'}
                </Link>
              </div>
            </>
          )}
          <div
            css={{
              paddingTop: `${24 / (13.6 / perRem) / perRem}em`,
              fontSize: `${13.6 / perRem}em`,
              color: lead.rgb,
            }}
          >
            Last updated:{' '}
            {formatDistance(new Date(), new Date(lastModifiedDate))} ago
          </div>
        </div>
        <TabNav>
          <TabLink href={route.about({}).$}>About</TabLink>
          {active && <TabLink href={route.calendar({}).$}>Calendar</TabLink>}
          {active && (
            <TabLink
              href={route.upcoming({}).$ + queryParamString(searchQuery)}
            >
              Upcoming Events ({upcomingEventsCount})
            </TabLink>
          )}

          <TabLink href={route.past({}).$ + queryParamString(searchQuery)}>
            Past Events ({pastEventsCount})
          </TabLink>
        </TabNav>
      </div>
      <div css={controlsStyles}>
        <EventSearch
          searchQuery={searchQuery}
          onChangeSearchQuery={onChangeSearchQuery}
        />
      </div>
    </header>
  );
};

export default InterestGroupProfileHeader;
