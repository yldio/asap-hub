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
import { rem, tabletScreen } from '../pixels';

const container = css({
  display: 'grid',
  paddingTop: rem(32),
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: rem(16),
  },
});

const rowTitleStyles = css({
  paddingTop: rem(32),
  paddingBottom: rem(16),
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${rem(20)} ${rem(24)} 0`,
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
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  gap: rem(8),
});

const teamNameStyles = css({
  display: 'flex',
  gap: rem(3),
});

const buttonStyles = css({
  width: rem(24),
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  cursor: 'pointer',
  alignSelf: 'center',
});

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
  const isLastUpdatedSortActive = sort.includes('last_updated');
  const isStatusSortActive = sort.includes('status');
  const isApcCoverageSortActive = sort.includes('apc_coverage');

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
                  : 'asc';

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
                description={'Team'}
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

                setSort(`last_updated_${newDirection}`);
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
                  : 'asc';

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
                description={'Status'}
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
                  : 'asc';

                setSort(`apc_coverage_${newDirection}`);
                setSortingDirection({
                  ...complianceInitialSortingDirection,
                  apcCoverage: newDirection,
                });
              }}
            >
              <AlphabeticalSortingIcon
                active={isApcCoverageSortActive}
                ascending={sortingDirection.apcCoverage === 'asc'}
                description={'APC Coverage'}
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
            <p>{row.lastUpdated}</p>
            <span css={[titleStyles, rowTitleStyles]}>Status</span>
            <p>{row.status}</p>
            <span css={[titleStyles, rowTitleStyles]}>APC Coverage</span>
            <p>{row.requestingApcCoverage}</p>
            <span css={[titleStyles, rowTitleStyles]}>Assigned Users</span>
            <div css={{ width: rem(32), alignSelf: 'center' }}>
              {row.assignedUsers.map((user) => (
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  imageUrl={user.avatarUrl}
                  key={user.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComplianceTable;
