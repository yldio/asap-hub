import {
  ComplianceSortingDirection,
  SortCompliance,
  PartialManuscriptResponse,
  manuscriptStatus,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { Avatar, Card, Link, Pill } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { formatDateToTimezone } from '../date';
import { rem, tabletScreen } from '../pixels';
import { getReviewerStatusType } from './ManuscriptCard';

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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr 1fr',
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

type ComplianceTableProps = {
  data: PartialManuscriptResponse[];
  sort?: SortCompliance;
  setSort?: React.Dispatch<React.SetStateAction<SortCompliance>>;
  sortingDirection?: ComplianceSortingDirection;
  setSortingDirection?: React.Dispatch<
    React.SetStateAction<ComplianceSortingDirection>
  >;
};

const getStatusAccent = (status: (typeof manuscriptStatus)[number]) => {
  const type = getReviewerStatusType(status);
  return type === 'warning' ? 'warning' : type === 'final' ? 'green' : 'blue';
};

const ComplianceTable: React.FC<ComplianceTableProps> = ({ data }) => (
  <Card>
    <div css={container}>
      <div css={[rowStyles, gridTitleStyles]}>
        <span css={titleStyles}>Team</span>
        <span css={titleStyles}>ID</span>
        <span css={titleStyles}>Last Updated</span>
        <span css={titleStyles}>Status</span>
        <span css={titleStyles}>APC Coverage</span>
        <span css={titleStyles}>Assigned Users</span>
      </div>
      {data.map((row) => (
        <div key={row.id} css={[rowStyles]}>
          <span css={[titleStyles, rowTitleStyles]}>Team</span>
          <p css={teamNameStyles}>
            <Link href={network({}).teams({}).team({ teamId: row.team.id }).$}>
              {row.team.displayName}
            </Link>
          </p>
          <span css={[titleStyles, rowTitleStyles]}>ID</span>
          <p>{<Pill accent="blue">{row.id}</Pill>}</p>
          <span css={[titleStyles, rowTitleStyles]}>Last Updated</span>
          <p>
            {formatDateToTimezone(row.lastUpdated, 'E, d MMM y').toUpperCase()}
          </p>
          <span css={[titleStyles, rowTitleStyles]}>Status</span>
          <p css={{ '> span': { borderRadius: rem(24) } }}>
            <Pill accent={row.status ? getStatusAccent(row.status) : 'blue'}>
              {row.status}
            </Pill>
          </p>
          <span css={[titleStyles, rowTitleStyles]}>APC Coverage</span>
          <p>{row.requestingApcCoverage}</p>
          <span css={[titleStyles, rowTitleStyles]}>Assigned Users</span>
          <div css={{ width: rem(32), alignSelf: 'center' }}>
            {row.assignedUsers?.map((user) => (
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

export default ComplianceTable;
