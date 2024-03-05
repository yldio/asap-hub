import { css } from '@emotion/react';
import { Card } from '../atoms';
import { charcoal, neutral200, steel } from '../colors';
import { perRem, tabletScreen } from '../pixels';

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
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

export type TeamMetric = {
  id: string;
  name: string;
  leadershipRoleCount: number;
  previousLeadershipRoleCount: number;
  memberCount: number;
  previousMemberCount: number;
};
interface LeadershipMembershipTableProps {
  data: TeamMetric[];
}

const LeadershipMembershipTable: React.FC<LeadershipMembershipTableProps> = ({
  data,
}) => (
  <Card padding={false}>
    <div css={container}>
      <div css={[rowStyles, gridTitleStyles]}>
        <span css={titleStyles}>Team</span>
        <span css={titleStyles}>Currently in a leadership role</span>
        <span css={titleStyles}>Previously in a leadership role</span>

        <span css={titleStyles}>Currently a member</span>
        <span css={titleStyles}>Previously a member</span>
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

export default LeadershipMembershipTable;
