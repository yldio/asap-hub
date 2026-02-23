import {
  PublicationComplianceResponse,
  PublicationComplianceSortingDirection,
  SortPublicationCompliance,
  publicationComplianceInitialSortingDirection,
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
  AlphabeticalSortingIcon,
  NumericalSortingIcon,
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

const buttonStyles = css({
  width: rem(24),
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  cursor: 'pointer',
  alignSelf: 'center',
});

type PublicationComplianceTableProps = ComponentProps<typeof PageControls> & {
  data: PublicationComplianceResponse[];
  setSort: React.Dispatch<React.SetStateAction<SortPublicationCompliance>>;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<PublicationComplianceSortingDirection>
  >;
  sort: SortPublicationCompliance;
  sortingDirection: PublicationComplianceSortingDirection;
};

const PublicationComplianceTable: React.FC<PublicationComplianceTableProps> = ({
  data,
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
  ...pageControlProps
}) => {
  const isTeamSortActive = sort.includes('team');
  const isPublicationsSortActive = sort.includes('publications');
  const isDatasetsSortActive = sort.includes('datasets');
  const isProtocolsSortActive = sort.includes('protocols');
  const isCodeSortActive = sort.includes('code');
  const isLabMaterialsSortActive = sort.includes('lab_materials');

  const getNewSortDirection = (
    isActive: boolean,
    currentDirection: 'asc' | 'desc',
    defaultDirection: 'asc' | 'desc',
  ): 'asc' | 'desc' => {
    if (!isActive) return defaultDirection;
    return currentDirection === 'asc' ? 'desc' : 'asc';
  };

  const handleTeamSort = () => {
    const newDirection = getNewSortDirection(
      isTeamSortActive,
      sortingDirection.team,
      'asc',
    );
    setSort(`team_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      team: newDirection,
    });
  };

  const handlePublicationsSort = () => {
    const newDirection = getNewSortDirection(
      isPublicationsSortActive,
      sortingDirection.publications,
      'desc',
    );
    setSort(`publications_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      publications: newDirection,
    });
  };

  const handleDatasetsSort = () => {
    const newDirection = getNewSortDirection(
      isDatasetsSortActive,
      sortingDirection.datasets,
      'desc',
    );
    setSort(`datasets_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      datasets: newDirection,
    });
  };

  const handleProtocolsSort = () => {
    const newDirection = getNewSortDirection(
      isProtocolsSortActive,
      sortingDirection.protocols,
      'desc',
    );
    setSort(`protocols_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      protocols: newDirection,
    });
  };

  const handleCodeSort = () => {
    const newDirection = getNewSortDirection(
      isCodeSortActive,
      sortingDirection.code,
      'desc',
    );
    setSort(`code_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      code: newDirection,
    });
  };

  const handleLabMaterialsSort = () => {
    const newDirection = getNewSortDirection(
      isLabMaterialsSortActive,
      sortingDirection.labMaterials,
      'desc',
    );
    setSort(`lab_materials_${newDirection}`);
    setSortingDirection({
      ...publicationComplianceInitialSortingDirection,
      labMaterials: newDirection,
    });
  };

  return (
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
                  <span css={headerStyles}>
                    Team
                    <button css={buttonStyles} onClick={handleTeamSort}>
                      <AlphabeticalSortingIcon
                        active={isTeamSortActive}
                        ascending={sortingDirection.team === 'asc'}
                      />
                    </button>
                  </span>
                </th>
                <th css={titleStyles} className={'publications'}>
                  <span css={headerStyles}>
                    Publications
                    <button css={buttonStyles} onClick={handlePublicationsSort}>
                      <NumericalSortingIcon
                        active={isPublicationsSortActive}
                        ascending={sortingDirection.publications === 'asc'}
                        description={'Publications'}
                      />
                    </button>
                  </span>
                </th>
                <th css={titleStyles} className={'datasets'}>
                  <span css={headerStyles}>
                    Datasets
                    <button css={buttonStyles} onClick={handleDatasetsSort}>
                      <NumericalSortingIcon
                        active={isDatasetsSortActive}
                        ascending={sortingDirection.datasets === 'asc'}
                        description={'Datasets'}
                      />
                    </button>
                  </span>
                </th>
                <th css={titleStyles} className={'protocols'}>
                  <span css={headerStyles}>
                    Protocols
                    <button css={buttonStyles} onClick={handleProtocolsSort}>
                      <NumericalSortingIcon
                        active={isProtocolsSortActive}
                        ascending={sortingDirection.protocols === 'asc'}
                        description={'Protocols'}
                      />
                    </button>
                  </span>
                </th>
                <th css={titleStyles} className={'code'}>
                  <span css={headerStyles}>
                    Code
                    <button css={buttonStyles} onClick={handleCodeSort}>
                      <NumericalSortingIcon
                        active={isCodeSortActive}
                        ascending={sortingDirection.code === 'asc'}
                        description={'Code'}
                      />
                    </button>
                  </span>
                </th>
                <th css={titleStyles}>
                  <span css={headerStyles}>
                    Lab Materials
                    <button css={buttonStyles} onClick={handleLabMaterialsSort}>
                      <NumericalSortingIcon
                        active={isLabMaterialsSortActive}
                        ascending={sortingDirection.labMaterials === 'asc'}
                        description={'Lab Materials'}
                      />
                    </button>
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
                        {row.overallCompliance === null
                          ? 'N/A'
                          : `${row.overallCompliance}%`}
                      </span>
                      {getPerformanceMoodIcon(
                        row.overallCompliance ?? 0,
                        row.overallCompliance === null,
                      )}
                    </p>
                  </td>
                  <td className={'datasets'}>
                    <p css={iconStyles}>
                      <span css={valueStyles}>
                        {row.datasetsPercentage === null ||
                        row.datasetsRanking === 'LIMITED DATA'
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
                        {row.protocolsPercentage === null ||
                        row.protocolsRanking === 'LIMITED DATA'
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
                        {row.codePercentage === null ||
                        row.codeRanking === 'LIMITED DATA'
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
                        {row.labMaterialsPercentage === null ||
                        row.labMaterialsRanking === 'LIMITED DATA'
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
};

export default PublicationComplianceTable;
