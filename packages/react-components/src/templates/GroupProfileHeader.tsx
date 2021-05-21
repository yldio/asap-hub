import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import formatDistance from 'date-fns/formatDistance';
import { network } from '@asap-hub/routing';

import { paper, lead, steel } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { Display, Link, TabLink } from '../atoms';
import { teamIcon } from '../icons';
import { TabNav } from '../molecules';
import { EventSearch } from '../organisms';
import { queryParamString } from '../routing';

const visualHeaderStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,
  marginBottom: `${30 / perRem}em`,
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

type GroupProfileHeaderProps = {
  readonly id: string;
  readonly name: string;
  readonly numberOfTeams: number;
  readonly lastModifiedDate: string;
  readonly groupTeamsHref: string;
} & ComponentProps<typeof EventSearch>;
const GroupProfileHeader: React.FC<GroupProfileHeaderProps> = ({
  id,
  name,
  numberOfTeams,
  lastModifiedDate,
  groupTeamsHref,

  searchQuery,
  onChangeSearchQuery,
}) => {
  const route = network({}).groups({}).group({ groupId: id });

  return (
    <header>
      <div css={visualHeaderStyles}>
        <Display styleAsHeading={2}>{name}</Display>
        <div css={belowHeadlineStyles}>
          <div
            css={{
              paddingRight: `${15 / perRem}em`,
              paddingTop: `${24 / perRem}em`,
              display: 'grid',
            }}
          >
            {teamIcon}
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
          <TabLink href={route.calendar({}).$}>Calendar</TabLink>
          <TabLink href={route.upcoming({}).$ + queryParamString(searchQuery)}>
            Upcoming Events
          </TabLink>
          <TabLink href={route.past({}).$ + queryParamString(searchQuery)}>
            Past Events
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

export default GroupProfileHeader;
