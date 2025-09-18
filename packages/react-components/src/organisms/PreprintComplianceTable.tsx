import {
  PreprintComplianceResponse,
  // PreprintComplianceSortingDirection,
  // SortPreprintCompliance,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';

import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import {
  InactiveBadgeIcon,
  // AlphabeticalSortingIcon,
  // NumericalSortingIcon,
  happyFaceIcon,
  neutralFaceIcon,
  sadFaceIcon,
  informationInverseIcon,
} from '../icons';
import { rem } from '../pixels';
import StaticPerformanceCard from './StaticPerformanceCard';

const container = css({
  overflowX: 'auto',
  borderRadius: rem(borderRadius),
  'th, td': {
    textAlign: 'left',
    paddingRight: rem(24),
    paddingLeft: rem(24),
  },
  'th.team, td.team': {
    borderRight: `1px solid ${steel.rgb}`,
  },
  'th.preprints, td.preprints': {
    borderRight: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  background: '#fff',
  verticalAlign: 'top',
  paddingTop: rem(32),
  overflowWrap: 'break-word',
});

const headerStyles = css({
  display: 'flex',
  columnGap: rem(8),
  alignItems: 'start',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.7,
  },
  '& svg': {
    flexShrink: 0,
    width: '24px',
    height: '24px',
  },
});

const rowStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  ':nth-of-type(even)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
});

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type PreprintComplianceTableProps = ComponentProps<typeof PageControls> & {
  data: PreprintComplianceResponse[];
  // setSort: React.Dispatch<React.SetStateAction<SortPreprintCompliance>>; // TODO: add these back post MVP
  // setSortingDirection: React.Dispatch<
  //   React.SetStateAction<PreprintComplianceSortingDirection>
  // >;
  // sort: SortPreprintCompliance;
  // sortingDirection: PreprintComplianceSortingDirection;
};

const PreprintComplianceTable: React.FC<PreprintComplianceTableProps> = ({
  data,
  // sort, // TODO: add these back post MVP
  // setSort,
  // sortingDirection,
  // setSortingDirection,
  ...pageControlProps
}) => {
  // const handleSort = (sortKey: SortPreprintCompliance) => {
  //   const newDirection =
  //     sort === sortKey && sortingDirection === 'asc' ? 'desc' : 'asc';
  //   setSortingDirection(newDirection);
  //   setSort(sortKey);
  // };

  // const getSortIcon = (sortKey: SortPreprintCompliance) => {
  //   const isActive = sort === sortKey;

  //   if (sortKey.startsWith('team_')) {
  //     return <AlphabeticalSortingIcon active={isActive} description="" />;
  //   }

  //   return <NumericalSortingIcon active={isActive} description="" />;
  // };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) {
      return happyFaceIcon;
    }
    if (percentage >= 80) {
      return neutralFaceIcon;
    }
    if (percentage > 0) {
      return sadFaceIcon;
    }
    return informationInverseIcon;
  };

  return (
    <>
      <StaticPerformanceCard />
      <Card padding={false}>
        <div css={container}>
          <table
            css={{
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
            }}
          >
            <colgroup>
              <col css={{ width: '33.33%' }} />
              <col css={{ width: '33.33%' }} />
              <col css={{ width: '33.33%' }} />
            </colgroup>
            <thead>
              <tr>
                <th css={titleStyles} className={'team'}>
                  <span
                    css={headerStyles}
                    // onClick={() => handleSort('team_asc')}
                  >
                    Team
                    {/* getSortIcon('team_asc') */}
                  </span>
                </th>
                <th css={titleStyles} className={'preprints'}>
                  <span
                    css={headerStyles}
                    // onClick={() => handleSort('preprints_asc')}
                  >
                    Number of Preprints
                    {/* getSortIcon('preprints_asc') */}
                  </span>
                </th>
                <th css={titleStyles}>
                  <span
                    css={headerStyles}
                    // onClick={() => handleSort('posted_prior_asc')}
                  >
                    Posted Prior to Journal Submission
                    {/* getSortIcon('posted_prior_asc') */}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.teamId} css={rowStyles}>
                  <td className={'team'}>
                    <p css={iconStyles}>
                      <span>
                        <Link
                          href={
                            network({}).teams({}).team({ teamId: row.teamId }).$
                          }
                        >
                          {row.teamName}
                        </Link>
                      </span>
                      {row.isTeamInactive && <InactiveBadgeIcon />}
                    </p>
                  </td>
                  <td className={'preprints'}>
                    <p>{row.numberOfPreprints}</p>
                  </td>
                  <td>
                    <p css={iconStyles}>
                      <span>{row.postedPriorPercentage}%</span>
                      {getPerformanceIcon(row.postedPriorPercentage)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <section css={pageControlsStyles}>
        <PageControls {...pageControlProps} />
      </section>
    </>
  );
};

export default PreprintComplianceTable;
