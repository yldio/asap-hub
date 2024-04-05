import { css } from '@emotion/react';
import { Card } from '../atoms';
import { charcoal, lead, neutral200, steel } from '../colors';
import { rem, tabletScreen } from '../pixels';
import { borderRadius } from '../card';
import { alumniBadgeIcon, InactiveBadgeIcon } from '../icons';

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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr 0.5fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });
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

type Team = {
  name: string;
  active: boolean;
};

const displayTeams = (items: { name: string; active: boolean }[]) => {
  if (items.length === 0) {
    return `No team`;
  }
  if (items.length === 1) {
    return items[0]?.active ? (
      items[0].name
    ) : (
      <span css={iconStyles}>
        {items[0]?.name} <InactiveBadgeIcon />
      </span>
    );
  }
  return (
    <>
      Multiple teams<span css={counterStyle}>{items.length}</span>
    </>
  );
};

const displayRoles = (items: string[]) => {
  if (items.length === 0) {
    return `No role`;
  }
  if (items.length === 1) {
    return items[0];
  }
  return (
    <>
      Multiple roles<span css={counterStyle}>{items.length}</span>
    </>
  );
};

export type UserProductivityMetric = {
  id: string;
  alumni: boolean;
  name: string;
  teams: Team[];
  roles: string[];
  asapOutput: number;
  asapPublicOutput: number;
  ratio: number;
};
interface UserProductivityTableProps {
  data: UserProductivityMetric[];
}

const UserProductivityTable: React.FC<UserProductivityTableProps> = ({
  data,
}) => (
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
            {row.name} {row.alumni && alumniBadgeIcon}
          </p>
          <span css={[titleStyles, rowTitleStyles]}>Team</span>
          <p>{displayTeams(row.teams)}</p>
          <span css={[titleStyles, rowTitleStyles]}>Role</span>
          <p>{displayRoles(row.roles)}</p>
          <span css={[titleStyles, rowTitleStyles]}>ASAP Output</span>
          <p>{row.asapOutput}</p>
          <span css={[titleStyles, rowTitleStyles]}>ASAP Public Output</span>
          <p>{row.asapPublicOutput}</p>
          <span css={[titleStyles, rowTitleStyles]}>Ratio</span>
          <p>{row.ratio}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default UserProductivityTable;
