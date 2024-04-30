import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Card } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { AlphabeticalSortingIcon, NumericalSortingIcon } from '../icons';
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
  return (
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>
            Team
            <button
              css={buttonStyles}
              onClick={() => {
                if (sortingDirection.team === 'asc') {
                  setSort('team_desc');
                  setSortingDirection({
                    ...sortingDirection,
                    team: 'desc',
                  });
                } else {
                  setSort('team_asc');
                  setSortingDirection({
                    ...sortingDirection,
                    team: 'asc',
                  });
                }
              }}
            >
              <AlphabeticalSortingIcon
                active={sort.includes('team')}
                ascending={sortingDirection.team === 'asc'}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Currently in a leadership role
            <button
              css={buttonStyles}
              onClick={() => {
                if (sortingDirection.currentLeadership === 'asc') {
                  setSort(`${indexPrefix}_current_leadership_desc`);
                  setSortingDirection({
                    ...sortingDirection,
                    currentLeadership: 'desc',
                  });
                } else {
                  setSort(`${indexPrefix}_current_leadership_asc`);
                  setSortingDirection({
                    ...sortingDirection,
                    currentLeadership: 'asc',
                  });
                }
              }}
            >
              <NumericalSortingIcon
                active={sort.includes('current_leadership')}
                ascending={sortingDirection.currentLeadership === 'asc'}
              />
            </button>
          </span>
          <span css={titleStyles}>
            Previously in a leadership role
            <button
              css={buttonStyles}
              onClick={() => {
                if (sortingDirection.previousLeadership === 'asc') {
                  setSort(`${indexPrefix}_previous_leadership_desc`);
                  setSortingDirection({
                    ...sortingDirection,
                    previousLeadership: 'desc',
                  });
                } else {
                  setSort(`${indexPrefix}_previous_leadership_asc`);
                  setSortingDirection({
                    ...sortingDirection,
                    previousLeadership: 'asc',
                  });
                }
              }}
            >
              <NumericalSortingIcon
                active={sort.includes('previous_leadership')}
                ascending={sortingDirection.previousLeadership === 'asc'}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Currently a member
            <button
              css={buttonStyles}
              onClick={() => {
                if (sortingDirection.currentMembership === 'asc') {
                  setSort(`${indexPrefix}_current_membership_desc`);
                  setSortingDirection({
                    ...sortingDirection,
                    currentMembership: 'desc',
                  });
                } else {
                  setSort(`${indexPrefix}_current_membership_asc`);
                  setSortingDirection({
                    ...sortingDirection,
                    currentMembership: 'asc',
                  });
                }
              }}
            >
              <NumericalSortingIcon
                active={sort.includes('current_membership')}
                ascending={sortingDirection.currentMembership === 'asc'}
              />
            </button>
          </span>
          <span css={titleStyles}>
            Previously a member
            <button
              css={buttonStyles}
              onClick={() => {
                if (sortingDirection.previousMembership === 'asc') {
                  setSort(`${indexPrefix}_previous_membership_desc`);
                  setSortingDirection({
                    ...sortingDirection,
                    previousMembership: 'desc',
                  });
                } else {
                  setSort(`${indexPrefix}_previous_membership_asc`);
                  setSortingDirection({
                    ...sortingDirection,
                    previousMembership: 'asc',
                  });
                }
              }}
            >
              <NumericalSortingIcon
                active={sort.includes('previous_membership')}
                ascending={sortingDirection.previousMembership === 'asc'}
              />
            </button>
          </span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p>{row.name}</p>
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
