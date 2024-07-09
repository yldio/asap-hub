import { networkRoutes as network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { InactiveBadgeIcon } from '..';
import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
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

const rowValueStyles = css({
  display: 'flex',
  gap: rem(6),
  fontWeight: 400,
});

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

export type EngagementData = {
  id: string;
  name: string;
  isInactive: boolean;
  memberCount: number;
  eventCount: number;
  totalSpeakerCount: number;
  uniqueAllRolesCount: number;
  uniqueKeyPersonnelCount: number;
};
type EngagementTableProps = {
  data: EngagementData[];
};

const EngagementTable: React.FC<EngagementTableProps> = ({ data }) => (
  <>
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Members</span>
          <span css={titleStyles}>Events</span>
          <span css={titleStyles}>Total Speakers</span>
          <span css={titleStyles}>Unique Speakers: All Roles</span>
          <span css={titleStyles}>Unique Speakers: Key Personnel</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p css={iconStyles}>
              <Link
                href={network.DEFAULT.TEAMS.DETAILS.buildPath({
                  teamId: row.id,
                })}
              >
                {row.name}
              </Link>

              {row.isInactive && <InactiveBadgeIcon />}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Members</span>
            <p css={rowValueStyles}>{row.memberCount} </p>
            <span css={[titleStyles, rowTitleStyles]}>Events</span>
            <p css={rowValueStyles}>{row.eventCount} </p>

            <span css={[titleStyles, rowTitleStyles]}>Total Speakers</span>
            <p css={rowValueStyles}>{row.totalSpeakerCount} </p>

            <span css={[titleStyles, rowTitleStyles]}>
              Unique Speakers: All Roles
            </span>
            <p css={rowValueStyles}>{row.uniqueAllRolesCount} </p>

            <span css={[titleStyles, rowTitleStyles]}>
              Unique Speakers: Key Personnel
            </span>
            <p css={rowValueStyles}>{row.uniqueKeyPersonnelCount} </p>
          </div>
        ))}
      </div>
    </Card>
  </>
);

export default EngagementTable;
