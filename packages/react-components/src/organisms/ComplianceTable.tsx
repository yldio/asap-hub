import {
  ComplianceSortingDirection,
  complianceInitialSortingDirection,
  SortCompliance,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { Avatar, Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { AlphabeticalSortingIcon, NumericalSortingIcon } from '../icons';
import { perRem, rem, tabletScreen } from '../pixels';

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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
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

const teamNameStyles = css({
  display: 'flex',
  gap: `${3 / perRem}em`,
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

type ComplianceTableProps = {
  data: PartialManuscriptResponse[];
  sort: SortCompliance;
  setSort: React.Dispatch<React.SetStateAction<SortCompliance>>;
  sortingDirection: ComplianceSortingDirection;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<ComplianceSortingDirection>
  >;
};

const ComplianceTable: React.FC<ComplianceTableProps> = ({
  data,
  sort,
  sortingDirection,
  setSort,
  setSortingDirection,
}) => {
  const isTeamSortActive = sort.includes('team');
  const isIdSortActive = sort.includes('id');
  const isLastUpdatedSortActive = sort.includes('lastUpdated');
  const isStatusSortActive = sort.includes('status');
  const isApcCoverageSortActive = sort.includes('apcCoverage');

  return (
    <Card>
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
                  : 'desc';

                setSort(`team_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
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
            ID
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isIdSortActive
                  ? sortingDirection.id === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`id_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
                  id: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isIdSortActive}
                ascending={sortingDirection.id === 'asc'}
                description={'ID'}
              />
            </button>
          </span>
          <span css={titleStyles}>
            Last Updated
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isLastUpdatedSortActive
                  ? sortingDirection.lastUpdated === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`lastUpdated_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
                  lastUpdated: newDirection,
                });
              }}
            >
              <NumericalSortingIcon
                active={isLastUpdatedSortActive}
                ascending={sortingDirection.lastUpdated === 'asc'}
                description={'Last Updated'}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Status
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isStatusSortActive
                  ? sortingDirection.status === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`status_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
                  status: newDirection,
                });
              }}
            >
              <AlphabeticalSortingIcon
                active={isStatusSortActive}
                ascending={sortingDirection.status === 'asc'}
              />
            </button>
          </span>
          <span css={titleStyles}>
            APC Coverage
            <button
              css={buttonStyles}
              onClick={() => {
                const newDirection = isApcCoverageSortActive
                  ? sortingDirection.apcCoverage === 'asc'
                    ? 'desc'
                    : 'asc'
                  : 'desc';

                setSort(`apcCoverage_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
                  apcCoverage: newDirection,
                });
              }}
            >
              <AlphabeticalSortingIcon
                active={isApcCoverageSortActive}
                ascending={sortingDirection.apcCoverage === 'asc'}
              />
            </button>
          </span>
          <span css={titleStyles}>Assigned Users</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p css={teamNameStyles}>
              <Link
                href={network({}).teams({}).team({ teamId: row.team.id }).$}
              >
                {row.team.displayName}
              </Link>
            </p>
            <span css={[titleStyles, rowTitleStyles]}>ID</span>
            <p>{row.id}</p>
            <span css={[titleStyles, rowTitleStyles]}>Last Updated</span>
            <p>{row.publishedAt}</p>
            <span css={[titleStyles, rowTitleStyles]}>Status</span>
            <p>{row.status}</p>
            <span css={[titleStyles, rowTitleStyles]}>APC Coverage</span>
            <p>{row.requestingApcCoverage}</p>
            <span css={[titleStyles, rowTitleStyles]}>Assigned Users</span>
            <p css={{ width: rem(32) }}>
              {row.assignedUsers.map((user) => (
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  imageUrl={user.avatarUrl}
                  key={user.id}
                />
              ))}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComplianceTable;
