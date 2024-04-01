import { css } from '@emotion/react';
import { Card } from '../atoms';
import { charcoal, neutral200, steel } from '../colors';
import { perRem, tabletScreen } from '../pixels';
import { borderRadius } from '../card';

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
    borderRadius: `${borderRadius / perRem}em`,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });
const counterStyle = css({
  marginLeft: `${9 / perRem}em`,
  display: 'inline-block',
  textAlign: 'center',
  minWidth: `${24 / perRem}em`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: '100%',
  fontWeight: 'bold',
});

const makeDisplay = (name: string) => (items: string[]) => {
  if (items.length === 0) {
    return `No ${name}`;
  }
  if (items.length === 1) {
    return items[0];
  }
  return (
    <>
      Multiple {name}s <span css={counterStyle}>{items.length}</span>
    </>
  );
};

const displayTeams = makeDisplay('team');
const displayRoles = makeDisplay('role');

export type UserProductivityMetric = {
  id: string;
  name: string;
  teams: string[];
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
          <p>{row.name}</p>
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
