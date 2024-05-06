import { TeamRole } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';

import { Card, Paragraph } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { alumniBadgeIcon, InactiveBadgeIcon } from '../icons';
import HoverTable from '../molecules/HoverTable';
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
  alignItems: 'baseline',
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
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const teamRowStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  justifyItems: 'left',
  textAlign: 'left',
  gridColumnGap: rem(24),
  maxWidth: rem(500),
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
  alignItems: 'center',
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type Team = {
  team: string;
  role?: TeamRole;
  isTeamInactive: boolean;
  outputsCoAuthored: number;
};

export type UserCollaborationMetric = {
  id: string;
  isAlumni: boolean;
  name: string;
  teams: Team[];
};

const TeamsInfo: React.FC<{
  teams: Team[];
}> = ({ teams }) => (
  <HoverTable
    header={
      <div css={teamRowStyles}>
        <span>Team</span>
        <span>Role</span>
        <span>Values</span>
      </div>
    }
  >
    {teams.map((team, idx) => (
      <div key={`team-row-${idx}`} css={teamRowStyles}>
        <Paragraph noMargin>{displayTeams([team])}</Paragraph>
        <Paragraph noMargin>{displayRoles([team])}</Paragraph>
        <Paragraph noMargin>{team.outputsCoAuthored}</Paragraph>
      </div>
    ))}
  </HoverTable>
);

const displayTeams = (items: UserCollaborationMetric['teams']) => {
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
      Multiple teams <TeamsInfo teams={items} />
    </>
  );
};

const displayRoles = (items: UserCollaborationMetric['teams']) => {
  if (items.length === 0) {
    return `No role`;
  }
  if (items.length === 1) {
    return items[0]?.role ? items[0].role : 'No role';
  }
  return (
    <>
      Multiple roles <TeamsInfo teams={items} />
    </>
  );
};

const displayOutputsCount = (items: UserCollaborationMetric['teams']) => {
  if (items.length === 0) {
    return `No values`;
  }
  if (items.length === 1) {
    const team = items[0] as Team;
    return team.outputsCoAuthored;
  }
  return (
    <>
      Multiple values <TeamsInfo teams={items} />
    </>
  );
};

type UserCollaborationTableProps = ComponentProps<typeof PageControls> & {
  data: UserCollaborationMetric[];
};

const UserCollaborationTable: React.FC<UserCollaborationTableProps> = ({
  data,
  ...pageControlProps
}) => (
  <>
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>User</span>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Role</span>
          <span css={titleStyles}>Outputs Co-Authored</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>User</span>
            <p css={iconStyles}>
              {row.name} {row.isAlumni && alumniBadgeIcon}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p>{displayTeams(row.teams)}</p>
            <span css={[titleStyles, rowTitleStyles]}>Role</span>
            <p>{displayRoles(row.teams)}</p>
            <span css={[titleStyles, rowTitleStyles]}>Outputs Co-Authored</span>
            <p>{displayOutputsCount(row.teams)}</p>
          </div>
        ))}
      </div>
    </Card>
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </>
);

export default UserCollaborationTable;
