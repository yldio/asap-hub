import { initialSortingDirection } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import {
  AlphabeticalSortingIcon,
  InactiveBadgeIcon,
  NumericalSortingIcon,
} from '../icons';
import { perRem, tabletScreen } from '../pixels';
import LeadershipPageBody from '../templates/AnalyticsLeadershipPageBody';

const container = css({
  display: 'grid',
  paddingTop: `${32 / perRem}em`,
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: `${16 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${32 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${20 / perRem}em ${24 / perRem}em 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':nth-of-type(2n+3)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: `${15 / perRem}em`,
    borderRadius: `${borderRadius / perRem}em`,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  gap: `${8 / perRem}em`,
});

const buttonStyles = css({
  width: `${24 / perRem}em`,
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  cursor: 'pointer',
  alignSelf: 'center',
});

export type TeamMetric = {
  id: string;
  name: string;
  leadershipRoleCount: number;
  previousLeadershipRoleCount: number;
  memberCount: number;
  previousMemberCount: number;
};
type LeadershipMembershipTableProps = Pick<
  ComponentProps<typeof LeadershipPageBody>,
  | 'data'
  | 'metric'
  | 'sort'
  | 'setSort'
  | 'sortingDirection'
  | 'setSortingDirection'
>;

const LeadershipMembershipTable: React.FC<LeadershipMembershipTableProps> = ({
  data,
  metric,
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
}) => {
  const indexPrefix = metric === 'working-group' ? 'wg' : 'ig';
  const iconDescription =
    metric === 'working-group' ? 'Working Group' : 'Interest Group';
  const isTeamSortActive = sort.includes('team');
  const isCurrentLeadershipSortActive = sort.includes('current_leadership');
  const isPreviousLeadershipSortActive = sort.includes('previous_leadership');
  const isCurrentMembershipSortActive = sort.includes('current_membership');
  const isPreviousMembershipSortActive = sort.includes('previous_membership');
  return (
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>
            Team
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isTeamSortActive
                  ? sortingDirection.team === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'asc';

                setSort(`team_${newDirection}`);
                setSortingDirection({
                  ...initialSortingDirection,
                  team: newDirection,
                });
              }}
            >
              <AlphabeticalSortingIcon
                active={isTeamSortActive}
                ascending={sortingDirection.team === 'asc'}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Currently in a leadership role
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isCurrentLeadershipSortActive
                  ? sortingDirection.currentLeadership === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`${indexPrefix}_current_leadership_${newDirection}`);
                setSortingDirection({
                  ...initialSortingDirection,
                  currentLeadership: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isCurrentLeadershipSortActive}
                ascending={sortingDirection.currentLeadership === 'asc'}
                description={`${iconDescription} Current Leadership`}
              />
            </button>
          </span>
          <span css={titleStyles}>
            Previously in a leadership role
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isPreviousLeadershipSortActive
                  ? sortingDirection.previousLeadership === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`${indexPrefix}_previous_leadership_${newDirection}`);
                setSortingDirection({
                  ...initialSortingDirection,
                  previousLeadership: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isPreviousLeadershipSortActive}
                ascending={sortingDirection.previousLeadership === 'asc'}
                description={`${iconDescription} Previous Leadership`}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Currently a member
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isCurrentMembershipSortActive
                  ? sortingDirection.currentMembership === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`${indexPrefix}_current_membership_${newDirection}`);
                setSortingDirection({
                  ...initialSortingDirection,
                  currentMembership: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isCurrentMembershipSortActive}
                ascending={sortingDirection.currentMembership === 'asc'}
                description={`${iconDescription} Current Membership`}
              />
            </button>
          </span>
          <span css={titleStyles}>
            Previously a member
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isPreviousMembershipSortActive
                  ? sortingDirection.previousMembership === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`${indexPrefix}_previous_membership_${newDirection}`);
                setSortingDirection({
                  ...initialSortingDirection,
                  previousMembership: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isPreviousMembershipSortActive}
                ascending={sortingDirection.previousMembership === 'asc'}
                description={`${iconDescription} Previous Membership`}
              />
            </button>
          </span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p>
              <Link href={network({}).teams({}).team({ teamId: row.id }).$}>
                {row.name}
              </Link>
              {row.inactiveSince && <InactiveBadgeIcon />}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>
              Currently in a leadership role
            </span>
            <p>{row.leadershipRoleCount}</p>
            <span css={[titleStyles, rowTitleStyles]}>
              Previously in a leadership role
            </span>
            <p>{row.previousLeadershipRoleCount}</p>
            <span css={[titleStyles, rowTitleStyles]}>Currently a member</span>
            <p>{row.memberCount}</p>
            <span css={[titleStyles, rowTitleStyles]}>Previously a member</span>
            <p>{row.previousMemberCount}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LeadershipMembershipTable;
