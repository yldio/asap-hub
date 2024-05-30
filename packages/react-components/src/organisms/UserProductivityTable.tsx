import {
  UserProductivityPerformance,
  UserProductivityResponse,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { CaptionCard, CaptionItem, PageControls } from '..';

import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, lead, neutral200, steel } from '../colors';
import { alumniBadgeIcon, InactiveBadgeIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';
import { getPerformanceIcon } from '../utils';

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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1.1fr 0.5fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

const rowValueStyles = css({
  display: 'flex',
  gap: rem(6),
  fontWeight: 400,
});

const counterStyle = css({
  display: 'inline-flex',
  color: lead.rgb,
  marginLeft: rem(9),
  textAlign: 'center',
  minWidth: rem(24),
  border: `1px solid ${steel.rgb}`,
  borderRadius: '100%',
  fontSize: '14px',
  fontWeight: 'bold',

  justifyContent: 'center',
  alignItems: 'center',
  width: rem(24),
  height: rem(24),
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

const displayTeams = (items: UserProductivityResponse['teams']) => {
  if (items.length === 0) {
    return `No team`;
  }
  if (items.length === 1) {
    return items[0] && !items[0].isTeamInactive ? (
      items[0].team
    ) : (
      <span css={iconStyles}>
        {items[0]?.team} <InactiveBadgeIcon />
      </span>
    );
  }
  return (
    <>
      Multiple teams<span css={counterStyle}>{items.length}</span>
    </>
  );
};

const displayRoles = (items: UserProductivityResponse['teams']) => {
  if (items.length === 0) {
    return `No role`;
  }
  if (items.length === 1) {
    return items[0]?.role ? items[0].role : 'No role';
  }
  return (
    <>
      Multiple roles<span css={counterStyle}>{items.length}</span>
    </>
  );
};

type UserProductivityTableProps = ComponentProps<typeof PageControls> & {
  data: UserProductivityResponse[];
  performance: UserProductivityPerformance;
};

const UserProductivityTable: React.FC<UserProductivityTableProps> = ({
  data,
  performance,
  ...pageControlProps
}) => (
  <>
    <CaptionCard>
      <>
        <CaptionItem label="ASAP Output" {...performance.asapOutput} />
        <CaptionItem
          label="ASAP Public Output"
          {...performance.asapPublicOutput}
        />
        <CaptionItem label="Ratio" {...performance.ratio} />
      </>
    </CaptionCard>
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>User</span>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Role</span>
          <span css={titleStyles}>ASAP Output</span>
          <span css={titleStyles}>ASAP Public Output</span>
          <span css={titleStyles}>Ratio</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>User</span>
            <p css={iconStyles}>
              <Link href={network({}).users({}).user({ userId: row.id }).$}>
                {row.name}
              </Link>
              {row.isAlumni && alumniBadgeIcon}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p>{displayTeams(row.teams)}</p>
            <span css={[titleStyles, rowTitleStyles]}>Role</span>
            <p>{displayRoles(row.teams)}</p>
            <span css={[titleStyles, rowTitleStyles]}>ASAP Output</span>
            <p css={rowValueStyles}>
              {row.asapOutput}{' '}
              {getPerformanceIcon(row.asapOutput, performance.asapOutput)}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>ASAP Public Output</span>
            <p css={rowValueStyles}>
              {row.asapPublicOutput}{' '}
              {getPerformanceIcon(
                row.asapPublicOutput,
                performance.asapPublicOutput,
              )}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Ratio</span>
            <p css={rowValueStyles}>
              {row.ratio}{' '}
              {getPerformanceIcon(parseFloat(row.ratio), performance.ratio)}
            </p>
          </div>
        ))}
      </div>
    </Card>
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </>
);

export default UserProductivityTable;
