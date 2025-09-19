import {
  SharingPrelimFindingsResponse,
  SharingPrelimFindingsSortingDirection,
  SortSharingPrelimFindings,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';

import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, lead, neutral200, steel } from '../colors';
import { InactiveBadgeIcon } from '../icons';
import { rem } from '../pixels';
import StaticPerformanceCard from './StaticPerformanceCard';
import { getPrelimPerformanceIcon } from '../utils';

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

const valueStyles = css({
  fontWeight: 400,
  fontSize: rem(17),
  textWrap: 'nowrap',
  color: lead.rgb,
  width: rem(45),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type SharingPrelimFindingsTableProps = ComponentProps<typeof PageControls> & {
  data: SharingPrelimFindingsResponse[];
  setSort: React.Dispatch<React.SetStateAction<SortSharingPrelimFindings>>;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<SharingPrelimFindingsSortingDirection>
  >;
  sort: SortSharingPrelimFindings;
  sortingDirection: SharingPrelimFindingsSortingDirection;
};

const SharingPrelimFindingsTable: React.FC<SharingPrelimFindingsTableProps> = ({
  data,
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
  ...pageControlProps
}) => (
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
            <col css={{ width: '50%' }} />
            <col css={{ width: '50%' }} />
          </colgroup>
          <thead>
            <tr>
              <th css={titleStyles} className={'team'}>
                <span css={headerStyles}>Team</span>
              </th>
              <th css={titleStyles}>
                <span css={headerStyles}>
                  <span>Percent Shared</span>
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
                <td>
                  <p css={iconStyles}>
                    <span css={valueStyles}>
                      {row.teamPercentShared !== null
                        ? `${row.teamPercentShared}%`
                        : 'N/A'}
                    </span>
                    {getPrelimPerformanceIcon(row.teamPercentShared || 0)}
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

export default SharingPrelimFindingsTable;
