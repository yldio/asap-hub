import {
  PublicationComplianceResponse,
  // PublicationComplianceSortingDirection,
  // SortPublicationCompliance,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';

import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, lead, neutral200, steel } from '../colors';
import {
  InactiveBadgeIcon,
  // AlphabeticalSortingIcon,
  // NumericalSortingIcon,
} from '../icons';
import { rem } from '../pixels';
import { getPerformanceMoodIcon } from '../utils';
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
  'th.publications, td.publications': {
    borderRight: `1px solid ${steel.rgb}`,
  },
  'th.datasets, td.datasets': {
    borderRight: `1px solid ${steel.rgb}`,
  },
  'th.protocols, td.protocols': {
    borderRight: `1px solid ${steel.rgb}`,
  },
  'th.code, td.code': {
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

const valueStyles = css({
  fontWeight: 400,
  fontSize: rem(17),
  textWrap: 'nowrap',
  color: lead.rgb,
  width: rem(60),
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

type PublicationComplianceTableProps = ComponentProps<typeof PageControls> & {
  data: PublicationComplianceResponse[];
  // setSort: React.Dispatch<React.SetStateAction<SortPublicationCompliance>>; // TODO: add these back post MVP
  // setSortingDirection: React.Dispatch<
  //   React.SetStateAction<PublicationComplianceSortingDirection>
  // >;
  // sort: SortPublicationCompliance;
  // sortingDirection: PublicationComplianceSortingDirection;
};

const PublicationComplianceTable: React.FC<PublicationComplianceTableProps> = ({
  data,
  // sort, // TODO: add these back post MVP
  // setSort,
  // sortingDirection,
  // setSortingDirection,
  ...pageControlProps
}) => (
  // const handleSort = (sortKey: SortPublicationCompliance) => { // TODO: add these back post MVP
  //   const newDirection =
  //     sort === sortKey && sortingDirection === 'asc' ? 'desc' : 'asc';
  //   setSortingDirection(newDirection);
  //   setSort(sortKey);
  // };

  // const getSortIcon = (sortKey: SortPublicationCompliance) => { // TODO: add these back post MVP
  //   const isActive = sort === sortKey;

  //   // Use AlphabeticalSortingIcon for team column (alphabetical)
  //   if (sortKey.startsWith('team_')) {
  //     return <AlphabeticalSortingIcon active={isActive} description="" />;
  //   }

  //   // Use NumericalSortingDescIcon for numerical columns
  //   return <NumericalSortingIcon active={isActive} description="" />;
  // };

  <>
    <StaticPerformanceCard legend="Percentage is calculated as total research outputs shared across all publications divided by total research outputs identified across all publications." />
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
            <col css={{ width: '16.67%' }} />
            <col css={{ width: '16.67%' }} />
            <col css={{ width: '16.67%' }} />
            <col css={{ width: '16.67%' }} />
            <col css={{ width: '16.67%' }} />
            <col css={{ width: '16.67%' }} />
          </colgroup>
          <thead>
            <tr>
              <th css={titleStyles} className={'team'}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('team_asc')}
                >
                  Team
                  {/* {getSortIcon('team_asc')} */}
                </span>
              </th>
              <th css={titleStyles} className={'publications'}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('publications_asc')}
                >
                  Publications
                  {/* {getSortIcon('publications_asc')} */}
                </span>
              </th>
              <th css={titleStyles} className={'datasets'}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('datasets_asc')}
                >
                  Datasets
                  {/* {getSortIcon('datasets_asc')} */}
                </span>
              </th>
              <th css={titleStyles} className={'protocols'}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('protocols_asc')}
                >
                  Protocols
                  {/* {getSortIcon('protocols_asc')} */}
                </span>
              </th>
              <th css={titleStyles} className={'code'}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('code_asc')}
                >
                  Code
                  {/* {getSortIcon('code_asc')} */}
                </span>
              </th>
              <th css={titleStyles}>
                <span
                  css={headerStyles}
                  // onClick={() => handleSort('lab_materials_asc')}
                >
                  Lab Materials
                  {/* {getSortIcon('lab_materials_asc')} */}
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
                          network({})
                            .teams({})
                            .team({ teamId: row.teamId ?? '' }).$
                        }
                      >
                        {row.teamName}
                      </Link>
                    </span>
                    {row.isTeamInactive && <InactiveBadgeIcon />}
                  </p>
                </td>
                <td className={'publications'}>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.numberOfPublications === null
                        ? 'N/A'
                        : row.numberOfPublications}
                    </span>
                  </p>
                </td>
                <td className={'datasets'}>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.datasetsPercentage === null
                        ? 'N/A'
                        : `${row.datasetsPercentage}%`}
                    </span>
                    {getPerformanceMoodIcon(
                      row.datasetsPercentage ?? 0,
                      row.datasetsRanking === 'LIMITED DATA',
                    )}
                  </p>
                </td>
                <td className={'protocols'}>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.protocolsPercentage === null
                        ? 'N/A'
                        : `${row.protocolsPercentage}%`}
                    </span>
                    {getPerformanceMoodIcon(
                      row.protocolsPercentage ?? 0,
                      row.protocolsRanking === 'LIMITED DATA',
                    )}
                  </p>
                </td>
                <td className={'code'}>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.codePercentage === null
                        ? 'N/A'
                        : `${row.codePercentage}%`}
                    </span>
                    {getPerformanceMoodIcon(
                      row.codePercentage ?? 0,
                      row.codeRanking === 'LIMITED DATA',
                    )}
                  </p>
                </td>
                <td>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.labMaterialsPercentage === null
                        ? 'N/A'
                        : `${row.labMaterialsPercentage}%`}
                    </span>
                    {getPerformanceMoodIcon(
                      row.labMaterialsPercentage ?? 0,
                      row.labMaterialsRanking === 'LIMITED DATA',
                    )}
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

export default PublicationComplianceTable;
